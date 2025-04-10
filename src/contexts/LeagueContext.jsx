import { createContext, useContext, useReducer, useCallback } from "react";
import { useUser } from "./UserContext";

const LeagueContext = createContext();

const initialStateAllLeagues = {
	allLeagues: [],
};

const initialStateMyLeagues = {
	myLeagues: [],
};

const initialStateLeague = {
	id: "",
	name: "",
	description: "",
	icon: null,
	visibility: "",
	coinName: "",
	maxCoins: 0,
	status: "",
	isAdmin: false,
	isRegistered: true,
	enableCaptain: false,
	teamMaxPlayers: 0,
	rules: [],
	participants: [],
	players: [],
	days: [],
};

function allLeaguesReducer(state, action) {
	switch (action.type) {
		case "findLeague":
			return { ...state, allLeagues: action.payload };

		default:
			return state;
	}
}

function myLeaguesReducer(state, action) {
	switch (action.type) {
		case "getMyLeagues":
			return { ...state, myLeagues: action.payload };

		case "createLeague":
			return {
				...state,
				myLeagues: [...state.myLeagues, action.payload],
			};

		case "updateLeague":
			return {
				...state,
				myLeagues: state.myLeagues.map((league) =>
					league.id === action.payload.id ? action.payload : league
				),
			};

		case "deleteLeague":
			return {
				...state,
				myLeagues: state.myLeagues.filter(
					(league) => league.id !== action.payload
				),
			};

		case "addParticipant":
			return {
				...state,
				myLeagues: [...state.myLeagues, action.payload],
			};

		case "resetMyLeague":
			return {
				...state,
				myLeagues: [],
			};

		default:
			return state;
	}
}

function leagueReducer(state, action) {
	switch (action.type) {
		case "updateLeague":
			return { ...state, ...action.payload };

		case "addPlayer":
			return { ...state, players: action.payload };

		case "updatePlayer":
			return {
				...state,
				players: state.players.map((player) =>
					player.id === action.payload.id ? action.payload : player
				),
			};

		case "deletePlayer":
			return {
				...state,
				players: state.players.filter(
					(player) => player.id !== action.payload
				),
			};

		case "addRule":
			return { ...state, rules: action.payload };

		case "updateRule":
			return {
				...state,
				rules: state.rules.map((rule) =>
					rule.id === action.payload.id ? action.payload : rule
				),
			};

		case "deleteRule":
			return {
				...state,
				rules: state.rules.filter((rule) => rule.id !== action.payload),
			};

		case "addDay":
			return { ...state, days: action.payload };

		case "updateDay":
			return {
				...state,
				days: state.days.map((day) =>
					day.id === action.payload.id ? action.payload : day
				),
			};

		case "deleteDay":
			return {
				...state,
				days: state.days.filter((day) => day.id !== action.payload),
			};

		case "updateParticipants":
			return {
				...state,
				participants: action.payload,
			};

		default:
			return state;
	}
}

function LeagueProvider({ children }) {
	const [allLeagues, dispatchAllLeagues] = useReducer(
		allLeaguesReducer,
		initialStateAllLeagues
	);

	const [myLeagues, dispatchMyLeagues] = useReducer(
		myLeaguesReducer,
		initialStateMyLeagues
	);

	const [league, dispatchLeague] = useReducer(
		leagueReducer,
		initialStateLeague
	);

	const { user, urlServer } = useUser();

	const findLeague = useCallback(
		async (dataBody) => {
			try {
				if (!user || !user.token) return;

				const response = await fetch(`${urlServer}/league/filter`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(dataBody),
				});

				if (!response.ok) {
					throw new Error("Errore nel caricamento della lega.");
				}

				const data = await response.json();
				dispatchAllLeagues({ type: "findLeague", payload: data });

				return data;
			} catch (error) {
				console.error(error.message);
			}
		},
		[user, urlServer]
	);

	const getMyLeagues = useCallback(async () => {
		try {
			if (!user || !user.token) return;

			const response = await fetch(`${urlServer}/league/myLeague`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nel caricamento delle leghe.");
			}

			const data = await response.json();
			dispatchMyLeagues({ type: "getMyLeagues", payload: data });

			return data;
		} catch (error) {
			console.error(error.message);
		}
	}, [user, urlServer]);

	const getLeague = useCallback(
		async (leagueId) => {
			try {
				if (!user || !user.token) return;

				const response = await fetch(
					`${urlServer}/league/${leagueId}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Errore nel caricamento della lega.");
				}

				const data = await response.json();
				dispatchLeague({ type: "updateLeague", payload: data });

				return data;
			} catch (error) {
				console.error(error.message);
			}
		},
		[user, urlServer]
	);

	const createLeague = async (formData) => {
		try {
			const response = await fetch(`${urlServer}/league`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				if (response.status === 409) {
					return { error: "Esiste già una lega con questo nome." };
				}
				throw new Error("Errore nella creazione di una nuova lega.");
			}

			const newLeague = await response.json();
			dispatchMyLeagues({ type: "createLeague", payload: newLeague });

			return newLeague;
		} catch (error) {
			console.error(error.message);
			return { error: "Errore nella creazione della lega. Riprova." };
		}
	};

	const updateLeague = async (updatedLeague) => {
		try {
			const response = await fetch(`${urlServer}/league`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedLeague),
			});

			if (!response.ok) {
				throw new Error("Errore nell'aggiornamento della lega.");
			}

			const updatedLeagueData = await response.json();

			dispatchLeague({
				type: "updateLeague",
				payload: updatedLeagueData,
			});

			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const getRanking = async (leagueId) => {
		try {
			const response = await fetch(
				`${urlServer}/league/ranking/${leagueId}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Errore nel caricamento della classifica.");
			}

			const participants = await response.json();

			dispatchLeague({
				type: "updateParticipants",
				payload: participants,
			});

			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const changeStatus = async (newStatus) => {
		try {
			const response = await fetch(
				`${urlServer}/league/changeStatus/${league.id}?newStatus=${newStatus}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Errore nell'aggiornamento della lega.");
			}

			const updatedLeagueData = await response.json();

			dispatchLeague({
				type: "updateLeague",
				payload: updatedLeagueData,
			});

			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const deleteLeague = async (leagueId) => {
		try {
			const response = await fetch(`${urlServer}/league/${leagueId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nella cancellazione della lega.");
			}

			dispatchMyLeagues({ type: "deleteLeague", payload: leagueId });
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const resetMyLeague = () => {
		dispatchLeague({ type: "resetMyLeague" });
	};

	return (
		<LeagueContext.Provider
			value={{
				allLeagues: allLeagues.allLeagues,
				myLeagues: myLeagues.myLeagues,
				league,
				findLeague,
				getMyLeagues,
				getLeague,
				createLeague,
				updateLeague,
				getRanking,
				changeStatus,
				deleteLeague,
				resetMyLeague,
				dispatchLeague,
			}}
		>
			{children}
		</LeagueContext.Provider>
	);
}

function useLeague() {
	const context = useContext(LeagueContext);
	if (!context) {
		throw new Error("useLeague must be used within a LeagueProvider");
	}
	return context;
}

export { LeagueProvider, useLeague };
