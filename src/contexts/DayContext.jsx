import { createContext, useContext } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const DayContext = createContext();

function DayProvider({ children }) {
	const { user, urlServer } = useUser();
	const { league, dispatchLeague } = useLeague();

	// Funzione per recuperare la singola giornata
	const getDay = async (dayId) => {
		try {
			const response = await fetch(`${urlServer}/day/${dayId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nel recupero della giornata.");
			}

			const day = await response.json();

			return day;
		} catch (error) {
			console.error("Errore nel recupero delle regole:", error.message);
			throw error;
		}
	};

	const addDay = async (dataDay) => {
		try {
			const response = await fetch(`${urlServer}/day`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					leagueId: league.id,
					days: dataDay.days,
				}),
			});

			if (!response.ok) {
				throw new Error("Errore nella creazione della giornata.");
			}

			const updatedDays = await response.json();
			dispatchLeague({
				type: "addDay",
				payload: updatedDays.days,
			});

			return updatedDays.days;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	// Funzione per aggiornare una giornata
	const updateDay = async (dataDay) => {
		try {
			const response = await fetch(`${urlServer}/day`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify(dataDay),
			});

			if (!response.ok) {
				throw new Error(`Errore nell'aggiornamento della giornata`);
			}

			const updatedDay = await response.json();
			dispatchLeague({
				type: "updateDay",
				payload: updatedDay,
			});
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	// Funzione per eliminare una giornata
	const deleteDay = async (dayId) => {
		try {
			const response = await fetch(`${urlServer}/day/${dayId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nella cancellazione della giornata.");
			}

			// await getLeague(league.id);

			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	return (
		<DayContext.Provider
			value={{
				getDay,
				addDay,
				updateDay,
				deleteDay,
			}}
		>
			{children}
		</DayContext.Provider>
	);
}

function useDay() {
	const context = useContext(DayContext);
	if (!context) {
		throw new Error("useDay must be used within a DayProvider");
	}
	return context;
}

export { DayProvider, useDay };
