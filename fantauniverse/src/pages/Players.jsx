import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Player from "../components/Player";
import GenericPopup from "../components/popups/GenericPopup";
import ModalPlayer from "../components/modals/ModalPlayer";
import NormalButton from "../atoms/Buttons/NormalButton";
import Loader from "../components/Loader";
import { usePlayer } from "../contexts/PlayerContext";

function Players() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [playerObj, setPlayerObj] = useState();
	const { league } = useLeague();
	const { players, isAdmin, status } = league;
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const { addPlayer, deletePlayer, updatePlayer } = usePlayer();

	const showPopup = (message, type) => {
		setPopupData({ isOpen: true, type: type, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type: type, message }),
			2000
		);
	};

	const handledeletePlayer = async (ruleId) => {
		setIsModalOpen(false);
		setIsLoading(true);
		await deletePlayer(ruleId);
		setIsLoading(false);
		showPopup("Player eliminato correttamente", "success");
	};

	const handleAddPlayer = async () => {
		setPlayerObj(null);
		setIsModalOpen(true);
		setIsEdit(false);
	};

	const handleEditPlayer = async (ruleObj) => {
		setPlayerObj(ruleObj);
		setIsModalOpen(true);
		setIsEdit(true);
	};

	const handleSubmitAdd = async (formData) => {
		setIsLoading(true);
		setIsModalOpen(false);
		const result = await addPlayer(formData);
		setIsLoading(false);
		if (!result) {
			showPopup("Errore nell'aggiunta del player", "error");
			return;
		}
		showPopup("Player aggiunto correttamente", "success");
	};

	const handleSubmitEdit = async (formData) => {
		setIsLoading(true);
		setIsModalOpen(false);
		const result = await updatePlayer(formData);
		setIsLoading(false);
		if (!result) {
			showPopup("Errore nell'aggiunta del player", "error");
			return;
		}
		showPopup("Player aggiunta correttamente", "success");
	};

	return (
		<>
			{isLoading && <Loader />}
			{players.length > 0 ? (
				<>
					{isAdmin && status === "PENDING" && (
						<div className="flex items-center gap-[8px] justify-between">
							<h6 className="body-regular font-semibold">
								Players
							</h6>
							<div className="flex items-center gap-[8px] justify-end">
								<p className="body-small">Aggiungi player</p>
								<button
									onClick={handleAddPlayer}
									className="p-[4px] bg-(--black-light) rounded-full"
								>
									<PlusIcon className="h-[16px] w-[16px]" />
								</button>
							</div>
						</div>
					)}

					<ul className="flex flex-col gap-[16px]">
						{players.map((el, idx) => (
							<Player
								key={idx}
								playerObj={el}
								onEdit={handleEditPlayer}
								canEdit={isAdmin && status === "PENDING"}
							/>
						))}
					</ul>
				</>
			) : (
				<div className="flex flex-col gap-[24px] items-center">
					<p className="body-normal font-semibold text-(--black-darker) text-center">
						Non hai ancora aggiunto nessun &rdquo;Giocatore&rdquo;
						acquistabile per la tua lega.
					</p>
					<NormalButton
						text="Aggiungi Player"
						action={handleAddPlayer}
					/>
				</div>
			)}

			{isAdmin && status === "PENDING" && (
				<>
					<ModalPlayer
						isOpen={isModalOpen}
						isEdit={isEdit}
						playerObj={playerObj}
						onClose={() => setIsModalOpen(false)}
						onSubmit={isEdit ? handleSubmitEdit : handleSubmitAdd}
						onDelete={handledeletePlayer}
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
