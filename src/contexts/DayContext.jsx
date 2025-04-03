import { createContext, useContext, useReducer } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const DayContext = createContext();

const initialState = {
	day: {},
};

function reducer(state, action) {
	switch (action.type) {
		case "getDay":
			return { ...state, day: action.payload };

		case "setDay":
			return { ...state, day: action.payload };

		default:
			return state;
	}
}

function DayProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { user, urlServer } = useUser();
	const { dispatchLeague } = useLeague();

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
			dispatch({ type: "getDay", payload: day });

			return day;
		} catch (error) {
			console.error("Errore nel recupero delle regole:", error.message);
			throw error;
		}
	};

	const createDay = async (dataDay) => {
		try {
			const response = await fetch(`${urlServer}/day`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataDay),
			});

			if (!response.ok) {
				throw new Error("Errore nella creazione della giornata.");
			}

			const updatedLeagueData = await response.json();

			dispatchLeague({
				type: "updateLeague",
				payload: updatedLeagueData,
			});

			return updatedLeagueData;
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

			dispatchLeague({ type: "updateDay", payload: updatedDay });
			return updatedDay;
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

			dispatchLeague({ type: "deleteDay", payload: dayId });
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	return (
		<DayContext.Provider
			value={{
				day: state.day,
				getDay,
				createDay,
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
