import { createContext, useContext } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const ParticipantContext = createContext();

function ParticipantProvider({ children }) {
	const { user, urlServer } = useUser();
	const { league, getLeague, dispatchLeague } = useLeague();

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

			const newParticipant = await response.json();

			dispatchLeague({
				type: "addParticipant",
				payload: newParticipant,
			});
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
