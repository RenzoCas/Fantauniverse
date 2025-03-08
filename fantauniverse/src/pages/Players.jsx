import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Player from "../components/Player";
import ModalAddPlayer from "../components/modals/ModalAddPlayer";
import GenericPopup from "../components/popups/GenericPopup";

function Players() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { league, deletePlayer } = useLeague();
	const { players, isAdmin } = league;
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});

	const showPopup = (message) => {
		setPopupData({ isOpen: true, type: "success", message });
		setTimeout(
			() => setPopupData({ isOpen: false, type: "success", message }),
			2000
		);
	};

	const handleDeletePlayer = async (playerId) => {
		await deletePlayer(playerId);
		showPopup("Player eliminato correttamente");
	};

	return (
		<>
			{isAdmin && (
				<div className="flex items-center gap-[8px] justify-end">
					<p className="body-small">Aggiungi player</p>
					<button
						onClick={() => setIsModalOpen(true)}
						className="p-[4px] bg-(--black-light) rounded-full"
					>
						<PlusIcon className="h-[16px] w-[16px]" />
					</button>
				</div>
			)}
			{players.length > 0 ? (
				<ul className="flex flex-col gap-[16px]">
					{players.map((el, idx) => (
						<Player
							key={idx}
							playerObj={el}
							onDelete={handleDeletePlayer}
							isAdmin={isAdmin}
						/>
					))}
				</ul>
			) : (
				<p className="body-normal font-semibold text-(--black-darker) text-center">
					Sembra che tu non abbia aggiunto nessun player.
				</p>
			)}
			{isAdmin && (
				<>
					<ModalAddPlayer
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						showPopup={showPopup}
					/>
					<GenericPopup
						isOpen={popupData.isOpen}
						type={popupData.type}
					>
						<p className="font-bold text-(--black-normal)">
							{popupData.message}
						</p>
					</GenericPopup>
				</>
			)}
		</>
	);
}

export default Players;
