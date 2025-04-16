import { createContext, useContext } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const RuleContext = createContext();

function RuleProvider({ children }) {
	const { user, urlServer } = useUser();
	const { league, dispatchLeague } = useLeague();

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

			const newRule = await response.json();
			dispatchLeague({
				type: "addRule",
				payload: newRule[0],
			});

			return true;
		} catch (error) {
			console.error("Errore nell'aggiunta della regola:", error.message);
			return null;
		}
	};

	// Funzione per aggiornare una regola
	const updateRule = async (ruleData) => {
		try {
			const response = await fetch(`${urlServer}/rule`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify(ruleData),
			});

			if (!response.ok) {
				throw new Error(`Errore nell'aggiornamento della regola`);
			}

			const updatedRule = await response.json();
			dispatchLeague({
				type: "updateRule",
				payload: updatedRule,
			});

			return true;
		} catch (error) {
			console.error(error.message);
			return false;
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

			dispatchLeague({
				type: "deleteRule",
				payload: ruleId,
			});
			return true;
		} catch (error) {
			console.error(
				"Errore nella cancellazione della regola:",
				error.message
			);
			return false;
		}
	};

	return (
		<RuleContext.Provider
			value={{
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
