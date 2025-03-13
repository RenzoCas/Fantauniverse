import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
	ArrowLeftCircleIcon,
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

function ViewLega() {
	const navigate = useNavigate();
	const { state } = useLocation();

	const { league, getLeague, updateLeague } = useLeague();
	const { addParticipant } = useParticipant();
	const { team, getMyTeam } = useTeam();

	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const { id, isAdmin } = state.league;
	const fileInputRef = useRef(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			await getLeague(id);
			await getMyTeam(id);
		} catch (error) {
			console.error(error.message);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const { description, name, status, isRegistered, icon } = league;
	const [tabActive, setTabActive] = useState("Rules");

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

	useEffect(() => {});

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
			// Assuming `res` has a success field
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

					// Make sure res is properly checked, log it for debugging
					const res = await updateLeague(updatedLeagueData);

					// Check if res is falsy or contains a failure message
					if (!res) {
						// Assuming `res` has a success field
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
						<div className="flex items-center justify-between gap-[16px]">
							<button
								onClick={() => {
									navigate(-1);
								}}
								className="flex items-center gap-[4px] text-(--accent-normal)"
							>
								<ArrowLeftCircleIcon className="h-[24px] w-[24px]" />
								<p className="body-normal">Indietro</p>
							</button>
						</div>
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
									<h2 className="title-h4">{name}</h2>
									{description != null && (
										<p className="body-small text-(--black-normal)">
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
							{tabActive === "Points" && <p>punti</p>}
							{tabActive === "Players" && <Players />}
							{tabActive === "Participants" && <Participants />}
						</div>
						{status === "NOT_STARTED" ? (
							!isRegistered ? (
								<NormalButton
									text="Unisciti alla lega"
									action={handleAddParticipant}
								/>
							) : (
								<CardSquadra
									team={team}
									handleClick={() => navigate("viewTeam")}
								/>
							)
						) : status === "STARTED" && isRegistered ? (
							<CardSquadra
								team={team}
								handleClick={() => navigate("viewTeam")}
							/>
						) : (
							status === "STARTED" &&
							!isRegistered && (
								<FixedPopup background="(--error-light)">
									<XMarkIcon className="w-[24px] h-[24px] flex-shrink-0" />
									<p className="font-bold text-(--black-normal)">
										Non puoi iscriverti, la lega è già
										avviata
									</p>
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
				</>
			)}
		</>
	);
}

export default ViewLega;
