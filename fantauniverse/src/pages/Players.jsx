import { PlusIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import { useState } from "react";
import GenericPopup from "../components/popups/GenericPopup";
import Player from "../components/Player";
import ModalAddPlayer from "../components/modals/ModalsAddPlayer";

function Players() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSuccessDelete, setIsSuccessDelete] = useState(false);
	const { league, deletePlayer } = useLeague();
	const { players, isAdmin } = league;

	const handleDeletePlayer = async (playerId) => {
		await deletePlayer(playerId);
		setIsSuccessDelete(true);
		setTimeout(() => {
			setIsSuccessDelete(false);
		}, 1000);
	};
	return (
		<>
			<div className="flex items-center gap-[16px] justify-end">
				<div className="flex items-center gap-[8px]">
					<p className="body-small">Aggiungi player</p>
					<button
						onClick={() => setIsModalOpen(true)}
						className="p-[4px] bg-(--black-light) rounded-full"
					>
						<PlusIcon className="h-[16px] w-[16px]" />
					</button>
				</div>
			</div>
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
					/>

					<GenericPopup isOpen={isSuccessDelete} type="success">
						<p className="font-bold text-(--black-normal)">
							Player eliminato correttamente
						</p>
					</GenericPopup>
				</>
			)}
		</>
	);
}

export default Players;
