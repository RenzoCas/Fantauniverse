import { createContext, useContext, useReducer } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const TeamContext = createContext();

const initialState = {
	team: {},
};

function reducer(state, action) {
	switch (action.type) {
		case "getTeam":
			return {
				...state,
				team: action.payload,
			};

		case "updateTeam":
			return {
				...state,
				team: action.payload,
			};

		case "deleteTeam":
			return {
				...state,
				team: {},
			};

		default:
			return state;
	}
}

function TeamProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { user, urlServer } = useUser();
	const { league, getLeague } = useLeague();

	const getMyTeam = async () => {
		if (!league.id) return;
		try {
			const response = await fetch(
				`${urlServer}/team/myTeam/${league.id}`,
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
			dispatch({
				type: "getTeam",
				payload: team,
			});

			await getLeague(league.id);
			return true;
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
			return team;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const deleteTeam = async () => {
		try {
			if (!league.id) throw new Error("Nessuna team selezionata.");

			const response = await fetch(`${urlServer}/team/${league.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nella cancellazione del team.");
			}

			dispatch({ type: "deleteTeam" });
			await getLeague(league.id);
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	return (
		<TeamContext.Provider
			value={{
				team: state.team,
				getMyTeam,
				getTeam,
				deleteTeam,
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
