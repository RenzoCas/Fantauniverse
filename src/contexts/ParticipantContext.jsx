import { createContext, useContext, useReducer } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const ParticipantContext = createContext();

const initialState = {
	participants: [],
};

function reducer(state, action) {
	switch (action.type) {
		case "addParticipant":
			return {
				...state,
				participants: [...state.participants, action.payload],
			};

		case "deleteParticipant":
			return {
				...state,
				participants: state.participants.filter(
					(participant) => participant.id !== action.payload
				),
			};

		default:
			return state;
	}
}

function ParticipantProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { user, urlServer } = useUser();
	const { league, getLeague } = useLeague();

	const addParticipant = async (leagueId) => {
		try {
			const response = await fetch(
				`${urlServer}/participant/${leagueId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok)
				throw new Error("Errore nell'aggiunta del partecipante.");

			await getLeague(leagueId);
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const deleteParticipant = async (leagueId) => {
		try {
			if (!league.id) throw new Error("Nessuna lega selezionata.");

			const response = await fetch(
				`${urlServer}/participant/${leagueId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Errore nella cancellazione del player.");
			}

			dispatch({ type: "deleteParticipant", payload: leagueId });
			await getLeague(league.id);
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	return (
		<ParticipantContext.Provider
			value={{
				participants: state.participants,
				addParticipant,
				deleteParticipant,
			}}
		>
			{children}
		</ParticipantContext.Provider>
	);
}

function useParticipant() {
	const context = useContext(ParticipantContext);
	if (!context) {
		throw new Error(
			"useParticipant must be used within a ParticipantProvider"
		);
	}
	return context;
}

export { ParticipantProvider, useParticipant };
