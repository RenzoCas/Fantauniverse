import { createContext, useContext } from "react";
import { useUser } from "./UserContext";
import { useLeague } from "./LeagueContext";

const PlayerContext = createContext();

function PlayerProvider({ children }) {
	const { user, urlServer } = useUser();
	const { league, dispatchLeague } = useLeague();

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

			const newPlayer = await response.json();
			dispatchLeague({
				type: "addPlayer",
				payload: newPlayer[0],
			});
			return newPlayer[0];
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

			const updatedPlayer = await response.json();
			dispatchLeague({
				type: "updatePlayer",
				payload: updatedPlayer,
			});
			return updatedPlayer;
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

			dispatchLeague({
				type: "deletePlayer",
				payload: playerId,
			});
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	const uploadImage = async (file, uploadUrl, id) => {
		const { tempUrl, publicUrl } = uploadUrl;
		try {
			const response = await fetch(tempUrl, {
				method: "PUT",
				headers: {
					"x-amz-acl": "public-read",
					"Content-Type": file.type,
				},
				body: file,
			});

			if (!response.ok) {
				throw {
					status: response.status,
					message: "Errore nel upload dell'immagine.",
				};
			}

			dispatchLeague({
				type: "updateIconPlayer",
				payload: { publicUrl, id },
			});
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	};

	return (
		<PlayerContext.Provider
			value={{
				addPlayer,
				updatePlayer,
				deletePlayer,
				uploadImage,
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
