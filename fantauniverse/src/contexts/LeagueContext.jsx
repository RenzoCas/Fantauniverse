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
	icon: [],
	admin: {},
	status: "",
	registered: true,
	rules: [],
	participants: [],
	players: [],
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

		case "deleteLeague":
			return {
				...state,
				myLeagues: state.myLeagues.filter(
					(league) => league.id !== action.payload
				),
			};

		case "addParicipant":
			return {
				...state,
				myLeagues: [...state.myLeagues, action.payload],
			};

		default:
			return state;
	}
}

function leagueReducer(state, action) {
	switch (action.type) {
		case "getLeague":
			return action.payload;

		case "addRule":
			return {
				...state,
				rules: action.payload,
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
				dispatchLeague({ type: "getLeague", payload: data });

				return data;
			} catch (error) {
				console.error(error.message);
			}
		},
		[user, urlServer]
	);

	const getMyLeagues = useCallback(async () => {
		try {
			if (!user || !user.token || myLeagues.myLeagues.length > 0) return;

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
	}, [user, urlServer, myLeagues]);

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
				dispatchLeague({ type: "getLeague", payload: data });

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
				throw new Error("Errore nella creazione di una nuova lega.");
			}

			const newLeague = await response.json();
			dispatchMyLeagues({ type: "createLeague", payload: newLeague });

			return newLeague;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	};

	const deleteLeague = async (leagueId) => {
		try {
			const response = await fetch(
				`${urlServer}/league/action/${leagueId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Errore nella cancellazione della lega.");
			}

			dispatchMyLeagues({ type: "deleteLeague", payload: leagueId });
		} catch (error) {
			console.error(error.message);
		}
	};

	const addParticipant = async (leagueId) => {
		try {
			const response = await fetch(
				`${urlServer}/league/action/addParticipant/${leagueId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok)
				throw new Error("Errore nell'aggiunta della regola");

			dispatchLeague({
				type: "addParicipant",
			});

			return true;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	};

	const addRule = async (ruleData) => {
		try {
			const response = await fetch(
				`${urlServer}/league/action/addRules`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						leagueId: league.id,
						rules: [ruleData],
					}),
				}
			);

			if (!response.ok)
				throw new Error("Errore nell'aggiunta della regola");

			const updatedLeague = await response.json();

			dispatchLeague({
				type: "addRule",
				payload: updatedLeague.rules,
			});

			return updatedLeague.rules;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	};

	const deleteRule = async (ruleId) => {
		try {
			if (!league.id) throw new Error("Nessuna lega selezionata.");

			const response = await fetch(
				`${urlServer}/league/action/deleteRule/${ruleId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Errore nella cancellazione della regola.");
			}

			dispatchLeague({
				type: "getLeague",
				payload: {
					...league,
					rules: league.rules.filter((rule) => rule.id !== ruleId),
				},
			});
		} catch (error) {
			console.error(error.message);
		}
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
				deleteLeague,
				addParticipant,
				addRule,
				deleteRule,
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
