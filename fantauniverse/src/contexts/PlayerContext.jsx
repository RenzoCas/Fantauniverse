import { createContext, useContext } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const PlayerContext = createContext();

function PlayerProvider({ children }) {
	const { user, urlServer } = useUser();
	const { league, getLeague } = useLeague();

	const addPlayer = async (playerData) => {
		try {
			const response = await fetch(`${urlServer}/player`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify({
					leagueId: league.id,
					players: [playerData],
				}),
			});

			if (!response.ok)
				throw new Error("Errore nell'aggiunta del player");

			await getLeague(league.id);
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const updatePlayer = async (playerData) => {
		try {
			const response = await fetch(`${urlServer}/player`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify(playerData),
			});

			if (!response.ok)
				throw new Error("Errore nell'aggiornamento del player");

			await getLeague(league.id);
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const deletePlayer = async (playerId) => {
		try {
			const response = await fetch(`${urlServer}/player/${playerId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nella cancellazione del player");
			}

			await getLeague(league.id);
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	return (
		<PlayerContext.Provider
			value={{
				players: league.players,
				addPlayer,
				updatePlayer,
				deletePlayer,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
}

function usePlayer() {
	const context = useContext(PlayerContext);
	if (!context) {
		throw new Error("usePlayer must be used within a PlayerProvider");
	}
	return context;
}

export { PlayerProvider, usePlayer };
// Compare this snippet from fantauniverse/src/pages/Settings.jsx:
