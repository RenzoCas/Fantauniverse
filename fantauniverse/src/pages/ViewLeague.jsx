import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
	ArrowLeftEndOnRectangleIcon,
	ChevronLeftIcon,
	PencilSquareIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Rules from "../pages/Rules";
import Tab from "../components/Tab";
import Ranking from "../pages/Ranking";
import Loader from "../components/Loader";
import FixedPopup from "../components/popups/FixedPopup";
import Players from "./Players";
import GenericPopup from "../components/popups/GenericPopup";
import GeneralSettings from "./GeneralSettings";
import NormalButton from "../atoms/Buttons/NormalButton";
import { useParticipant } from "../contexts/ParticipantContext";
import Participants from "./Participants";
import CardSquadra from "../components/CardSquadra";
import { useTeam } from "../contexts/TeamContext";
import Points from "./Points";
import ModalConfirmAction from "../components/modals/ModalConfirmAction";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

function ViewLega() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { league, getLeague, updateLeague } = useLeague();
	const { addParticipant, deleteParticipant } = useParticipant();
	const { team, getMyTeam } = useTeam();

	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const { id, isAdmin } = state.league;

	const fileInputRef = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (id != league.id) {
					setIsLoading(true);
					await getLeague(id);
					await getMyTeam(id);
					setIsLoading(false);
				}
			} catch (error) {
				console.error(error.message);
			}
		};

		fetchData();
	}, [id]);

	const { description, name, status, isRegistered, icon } = league;
	const [tabActive, setTabActive] = useState();
	const [textModal, setTextModal] = useState();
	const [disclaimerModal, setDisclaimerModal] = useState();
	const [isModalConfirmOpen, setIsModalConfirmOpen] = useState({
		action: null,
		value: false,
	});

	const showModalConfirmDelete = () => {
		setTextModal("Sei sicuro di volerti disiscrivere da questa lega?");
		setDisclaimerModal("Confermando non parteciperai piú a questa lega.");
		setIsModalConfirmOpen({ action: "delete", value: true });
	};

	useEffect(() => {
		setTabActive(
			`${
				isAdmin
					? "General"
					: status == "NOT_STARTED"
					? "Participants"
					: "Ranking"
			}`
		);
	}, [status, isAdmin]);

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleTabChange = (tab) => {
		setTabActive(tab);
	};

	const handleAddParticipant = async () => {
		setIsLoading(true);
		const res = await addParticipant(id);
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore nell'iscrizione alla lega!",
				"L'iscrizione a questa lega non é andata a buon fine. Riprova."
			);
			return;
		}
		await getLeague(id);
		setIsLoading(false);
		showPopup(
			"success",
			"Iscrizione effettuata!",
			"L'iscrizione a questa lega é andata a buon fine."
		);
	};

	const handleRemovePartecipant = async () => {
		setIsModalConfirmOpen({ action: null, value: false });
		setIsLoading(true);
		const res = await deleteParticipant(id);
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore!",
				"La cancellazione da questa lega non é andata a buon fine. Riprova."
			);
			return;
		}
		await getLeague(id);
		setIsLoading(false);
		showPopup(
			"success",
			"Cancellazione effettuata!",
			"Non sei piú iscritto a questa lega."
		);
		setTimeout(() => {
			navigate("/");
		}, 1000);
	};

	const handleUpdateImage = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (event) => {
		try {
			const file = event.target.files[0];
			if (
				file &&
				(file.type === "image/jpeg" || file.type === "image/png")
			) {
				const reader = new FileReader();
				reader.onloadend = async () => {
					const base64Image = reader.result.split(",")[1];
					const updatedLeagueData = { id: id, icon: base64Image };
					setIsLoading(true);

					const res = await updateLeague(updatedLeagueData);

					if (!res) {
						setIsLoading(false);
						showPopup(
							"error",
							"Errore nell'aggiornamento dell'immagine!",
							"Immagine non caricata correttamente. Riprova."
						);
						return;
					}

					await getLeague(id);
					setIsLoading(false);
				};
				reader.readAsDataURL(file);
			} else {
				throw new Error("Per favore seleziona un file JPEG o PNG.");
			}
		} catch (error) {
			showPopup(
				"error",
				"Errore nell'aggiornamento dell'immagine!",
				`${error.message}`
			);
		}
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className="flex flex-col gap-[16px] flex-1">
						<button
							onClick={() => {
								navigate("/app");
							}}
							className="flex items-center gap-[4px] text-(--accent-normal)"
						>
							<ChevronLeftIcon className="h-[20px] w-[20px]" />
							<p className="body-normal">Indietro</p>
						</button>
						<div className="top flex flex-col gap-[16px] flex-1">
							{status === "PENDING" && (
								<input
									type="file"
									name="logoLega"
									id="logoLega"
									accept="image/jpeg, image/png"
									onChange={handleFileChange}
									ref={fileInputRef}
									className="hidden"
								/>
							)}
							<picture
								className="relative w-full rounded-[8px]"
								onClick={handleUpdateImage}
							>
								<img
									src={
										icon != null
											? `data:image/png;base64,${icon}`
											: "https://placehold.co/360x202"
									}
									alt="Logo lega"
									className="w-full rounded-[8px] h-auto object-cover"
									style={{ cursor: "pointer" }}
								/>
								{status === "PENDING" && (
									<div className="absolute bottom-[8px] right-[8px] p-[10px] rounded-full bg-(--black-light)">
										<PencilSquareIcon className="h-[20px] w-[20px]" />
									</div>
								)}
							</picture>
							{status != "PENDING" && (
								<>
									<div className="flex items-center justify-between">
										<h2 className="title-h4">{name}</h2>
										{status == "NOT_STARTED" &&
											isRegistered && (
												<button
													className="flex items-center gap-[4px]"
													onClick={
														showModalConfirmDelete
													}
												>
													<ArrowLeftEndOnRectangleIcon className="h-[24px] w-[24px]" />
												</button>
											)}
									</div>
									{description != null && (
										<p className="body-normal text-(--black-normal)">
											{description}
										</p>
									)}
								</>
							)}

							<Tab
								tabActive={tabActive}
								handleTabChange={handleTabChange}
								isAdmin={isAdmin}
								status={status}
							/>
							{tabActive === "General" && <GeneralSettings />}
							{tabActive === "Rules" && <Rules />}
							{tabActive === "Ranking" && <Ranking />}
							{tabActive === "Days" && (
								<Points isAdmin={isAdmin} />
							)}
							{tabActive === "Players" && <Players />}
							{tabActive === "Participants" && <Participants />}
						</div>
						{status === "NOT_STARTED" ? (
							!isRegistered ? (
								<NormalButton
									text="Unisciti alla lega"
									action={handleAddParticipant}
									classOpt="sticky bottom-[32px]"
								/>
							) : (
								<CardSquadra
									team={team}
									handleClick={() => navigate("viewTeam")}
								/>
							)
						) : status === "STARTED" && isRegistered ? (
							<>
								{tabActive == "Ranking" && (
									<CardSquadra
										team={team}
										handleClick={() => navigate("viewTeam")}
									/>
								)}
							</>
						) : status === "STARTED" && !isRegistered ? (
							<FixedPopup background="(--error-light)">
								<XMarkIcon className="w-[24px] h-[24px] flex-shrink-0" />
								<p className="font-bold text-(--black-normal)">
									Non puoi iscriverti, la lega è già avviata
								</p>
							</FixedPopup>
						) : (
							status === "FINISHED" && (
								<FixedPopup
									title="Lega terminata"
									message={`Questa lega é terminata. Controlla la classifica per verificare il vincitore.`}
									customIcon={true}
								>
									<ExclamationTriangleIcon className="w-[16px] h-[16px] flex-shrink-0 fill-orange-500" />
								</FixedPopup>
							)
						)}
					</div>
					<GenericPopup
						isOpen={popupData.isOpen}
						type={popupData.type}
						title={popupData.title}
						message={popupData.message}
					/>
					<ModalConfirmAction
						isOpen={isModalConfirmOpen.value}
						text={textModal}
						disclaimer={disclaimerModal}
						onClose={() =>
							setIsModalConfirmOpen({
								action: null,
								value: false,
							})
						}
						onConfirmAction={handleRemovePartecipant}
					></ModalConfirmAction>
				</>
			)}
		</>
	);
}

export default ViewLega;
