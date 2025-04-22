import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Player from "../components/Player";
import GenericPopup from "../components/popups/GenericPopup";
import ModalPlayer from "../components/modals/ModalPlayer";
import NormalButton from "../atoms/Buttons/NormalButton";
import Loader from "../components/Loader";
import { usePlayer } from "../contexts/PlayerContext";
import { useUser } from "../contexts/UserContext";

function Players() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [playerObj, setPlayerObj] = useState();
	const { league } = useLeague();
	const { players, isAdmin, status } = league;
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		title: "",
		message: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const { getUrlImage } = useUser();
	const { addPlayer, deletePlayer, updatePlayer, uploadImage } = usePlayer();

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handledeletePlayer = async (playerId) => {
		setIsModalOpen(false);
		setIsLoading(true);
		const response = await deletePlayer(playerId);
		setIsLoading(false);
		if (!response) {
			showPopup(
				"error",
				"Player non eliminato",
				"Il player selezionato non é stato eliminato. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Player eliminato",
			"Il player selezionato é stato eliminato correttamente."
		);
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
		const tempFormData = { ...formData, icon: "" };
		const result = await addPlayer(tempFormData);

		if (!result) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore nell'aggiunta del player",
				"Il player non é stato aggiunto correttamente. Riprova."
			);
			return;
		}
        
        if (formData.icon != "") {
            const filename = `${formData.icon.name}`;
            const urlImage = await getUrlImage({
                id: result.id,
                fileName: filename,
                referredTo: "PLAYER",
            });
    
            if (!urlImage) {
                setIsLoading(false);
                showPopup(
                    "error",
                    "Errore nell'aggiunta dell'immagine!",
                    "Il player é stato correttamente aggiunto, ma l'immagine non é stata caricata. Riprova."
                );
                return;
            }
    
            await uploadImage(formData.icon, urlImage, result.id);
        }
		
		setIsLoading(false);
		showPopup(
			"success",
			"Player aggiunto",
			"Il player é stato aggiunto correttamente."
		);
	};

	const handleSubmitEdit = async (formData) => {
		setIsLoading(true);
		setIsModalOpen(false);
		let result = null;
		const tempFormData = { ...formData, icon: "" };
		result = await updatePlayer(tempFormData);
		if (formData.icon) {
			const filename = `${formData.icon.name}`;
			const urlImage = await getUrlImage({
				id: result.id,
				fileName: filename,
				referredTo: "PLAYER",
			});
			if (!urlImage) {
				setIsLoading(false);
				showPopup(
					"error",
					"Errore nella modifica dell'immagine!",
					"L'immagine non é stata aggiornata. Riprova."
				);
				return;
			}

			await uploadImage(formData.icon, urlImage, result.id);
		}

		setIsLoading(false);
		if (!result) {
			showPopup(
				"error",
				"Errore nella modifica del player",
				"Il player non é stato modificato correttamente. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Player modificato",
			"Il player é stato modificato correttamente."
		);
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
							<button
								onClick={handleAddPlayer}
								className="flex items-center gap-[8px] justify-end cursor-pointer"
							>
								<p className="body-small whitespace-nowrap">
									Aggiungi player
								</p>
								<PlusIcon className="h-[24px] w-[24px] p-[4px] bg-(--black-light) rounded-full flex-shrink-0" />
							</button>
						</div>
					)}

					<ul className="flex flex-col gap-[16px]">
						{players.map((el, idx) => (
							<Player
								key={idx}
								playerObj={el}
								onEdit={handleEditPlayer}
								canEdit={isAdmin && status === "PENDING"}
								viewTeam={false}
							/>
						))}
					</ul>
				</>
			) : (
				<div className="flex flex-col gap-[24px] items-center flex-1">
					<p className="body-normal font-semibold text-(--black-darker) text-center">
						Non hai ancora aggiunto nessun &rdquo;Giocatore&rdquo;
						acquistabile per la tua lega.
					</p>
					<NormalButton
						text="Aggiungi giocatore"
						action={handleAddPlayer}
						customIcon={true}
					>
						<PlusIcon className="h-[24px] w-[24px] flex-shrink-0" />
					</NormalButton>
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
						title={popupData.title}
						message={popupData.message}
					/>
				</>
			)}
		</>
	);
}

export default Players;
