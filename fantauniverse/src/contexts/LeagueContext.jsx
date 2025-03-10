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
	visibility: "",
	coinName: "",
	maxCoins: 0,
	icon: null,
	isAdmin: false,
	status: "",
	isRegistered: true,
	leagueInfoCompleted: false,
	rules: [],
	participants: [],
	players: [],
	days: [],
};

function allLeaguesReducer(state, action) {
	switch (action.type) {
		case "getAllLeague":
			return { ...state, allLeagues: action.payload };

		case "findLeague":
			return action.payload;

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

	const getAllLeagues = useCallback(async () => {
		try {
			if (!user || !user.token) return;

			const response = await fetch(`${urlServer}/league`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nel caricamento delle leghe.");
			}

			const data = await response.json();
			dispatchAllLeagues({ type: "getAllLeagues", payload: data });

			return data;
		} catch (error) {
			console.error(error.message);
		}
	}, [user, urlServer]);

	const findLeague = useCallback(
		async (name) => {
			try {
				if (!user || !user.token) return;

				const response = await fetch(
					`${urlServer}/league/filter?name=${name}`,
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
					`${urlServer}/league/filter?id=${leagueId}`,
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

			dispatchMyLeagues({
				type: "updateLeague",
				payload: updatedLeagueData,
			});

			return updatedLeagueData;
		} catch (error) {
			console.error(error.message);
			return null;
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
		} catch (error) {
			console.error(error.message);
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
				getAllLeagues,
				findLeague,
				getMyLeagues,
				getLeague,
				createLeague,
				updateLeague,
				deleteLeague,
				resetMyLeague,
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
