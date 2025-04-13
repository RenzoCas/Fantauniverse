import { createContext, useContext, useReducer } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const TeamContext = createContext();

const initialState = {
	team: null,
	teamParticipant: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "getTeam":
			return {
				...state,
				teamParticipant: action.payload,
			};
		case "getMyTeam":
			return {
				...state,
				team: action.payload,
			};

		case "createTeam":
			return {
				...state,
				team: action.payload,
			};

		case "updateTeam":
			return {
				...state,
				team: action.payload,
			};

		case "resetTeamPartecipant":
			return {
				...state,
				teamParticipant: null,
			};

		case "deleteTeam":
			return {
				...state,
				team: null,
			};

		default:
			return state;
	}
}

function TeamProvider({ children }) {
	const [state, dispatchTeam] = useReducer(reducer, initialState);
	const { user, urlServer } = useUser();
	const { league, getLeague } = useLeague();

	const getMyTeam = async (leagueId) => {
		try {
			const response = await fetch(
				`${urlServer}/team/myTeam/${leagueId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) throw new Error("Errore nel recupero del team.");

			const team = await response.json();

			dispatchTeam({
				type: "getMyTeam",
				payload: team,
			});
			return team;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const getTeam = async (participantId) => {
		try {
			const response = await fetch(
				`${urlServer}/team/userTeam/${participantId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok)
				throw new Error("Errore nell'aggiunta del partecipante.");

			const team = await response.json();
			dispatchTeam({
				type: "getTeam",
				payload: team,
			});
			return team;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const createTeam = async (team) => {
		try {
			const response = await fetch(`${urlServer}/team`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(team),
			});

			if (!response.ok) {
				throw new Error("Errore nella creazione del team.");
			}

			const data = await response.json();

			dispatchTeam({ type: "createTeam", payload: data });
			await getLeague(league.id);
			return data;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const updateTeam = async (team) => {
		try {
			const response = await fetch(`${urlServer}/team`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(team),
			});

			if (!response.ok) {
				throw new Error("Errore nell'aggiornamento del team.");
			}

			const data = await response.json();

			dispatchTeam({ type: "updateTeam", payload: data });
			await getLeague(league.id);
			return data;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const deleteTeam = async () => {
		try {
			if (!league.id) throw new Error("Nessuna team selezionata.");

			const response = await fetch(`${urlServer}/team/${state.team.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nella cancellazione del team.");
			}

			dispatchTeam({ type: "deleteTeam" });
			await getLeague(league.id);
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const resetTeamPartecipant = () => {
		dispatchTeam({ type: "resetTeamPartecipant" });
	};

	return (
		<TeamContext.Provider
			value={{
				team: state.team,
				teamParticipant: state.teamParticipant,
				getMyTeam,
				getTeam,
				createTeam,
				updateTeam,
				deleteTeam,
				resetTeamPartecipant,
				dispatchTeam,
			}}
		>
			{children}
		</TeamContext.Provider>
	);
}

function useTeam() {
	const context = useContext(TeamContext);
	if (!context) {
		throw new Error("useTeam must be used within a TeamProvider");
	}
	return context;
}

export { TeamProvider, useTeam };
