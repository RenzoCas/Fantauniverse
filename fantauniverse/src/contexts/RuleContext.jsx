import { createContext, useContext, useReducer } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const RuleContext = createContext();

const initialState = {
	rules: [],
};

function reducer(state, action) {
	switch (action.type) {
		case "setRules":
			return { ...state, rules: action.payload };

		default:
			return state;
	}
}

function RuleProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { user, urlServer } = useUser();
	const { league, getLeague } = useLeague();

	// Funzione per recuperare le regole
	const getRules = async (leagueId) => {
		try {
			const response = await fetch(`${urlServer}/rule/${leagueId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nel recupero delle regole.");
			}

			const rules = await response.json();
			dispatch({ type: "setRules", payload: rules });

			return rules;
		} catch (error) {
			console.error("Errore nel recupero delle regole:", error.message);
			throw error;
		}
	};

	// Funzione per aggiungere una nuova regola
	const addRule = async (ruleData) => {
		try {
			const response = await fetch(`${urlServer}/rule`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify({
					leagueId: league.id,
					rules: [ruleData],
				}),
			});

			if (!response.ok)
				throw new Error("Errore nell'aggiunta della regola");

			const updatedLeague = await response.json();
			dispatch({ type: "setRules", payload: updatedLeague.rules });
			await getLeague(league.id);

			return updatedLeague;
		} catch (error) {
			console.error("Errore nell'aggiunta della regola:", error.message);
			return null;
		}
	};

	// Funzione per aggiornare una regola
	const updateRule = async (ruleData, ruleId) => {
		try {
			const response = await fetch(`${urlServer}/rule`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify({
					rules: ruleData,
				}),
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(
					`Errore nell'aggiornamento della regola: ${errorMessage}`
				);
			}

			const updatedRule = await response.json();

			// Aggiorniamo la lista delle regole con la regola aggiornata
			const updatedRules = state.rules.map((rule) =>
				rule.id === ruleId ? updatedRule : rule
			);

			dispatch({ type: "setRules", payload: updatedRules });
			await getLeague(league.id);

			return updatedRule;
		} catch (error) {
			console.error(
				"Errore nell'aggiornamento della regola:",
				error.message
			);
			return { error: error.message };
		}
	};

	// Funzione per eliminare una regola
	const deleteRule = async (ruleId) => {
		try {
			if (!league.id) throw new Error("Nessuna lega selezionata.");

			const response = await fetch(`${urlServer}/rule/${ruleId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${user.token}` },
			});

			if (!response.ok) {
				throw new Error("Errore nella cancellazione della regola.");
			}

			const updatedRules = state.rules.filter(
				(rule) => rule.id !== ruleId
			);
			dispatch({ type: "setRules", payload: updatedRules });
			await getLeague(league.id);
		} catch (error) {
			console.error(
				"Errore nella cancellazione della regola:",
				error.message
			);
		}
	};

	return (
		<RuleContext.Provider
			value={{
				rules: state.rules,
				getRules,
				addRule,
				updateRule,
				deleteRule,
			}}
		>
			{children}
		</RuleContext.Provider>
	);
}

function useRule() {
	const context = useContext(RuleContext);
	if (!context) {
		throw new Error("useRule must be used within a RuleProvider");
	}
	return context;
}

export { RuleProvider, useRule };
