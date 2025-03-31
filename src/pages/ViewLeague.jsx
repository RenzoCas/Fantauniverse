import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Rules from "../pages/Rules";
import Tab from "../components/Tab";
import Ranking from "../pages/Ranking";
import Loader from "../components/Loader";
import Players from "./Players";
import GenericPopup from "../components/popups/GenericPopup";
import GeneralSettings from "./GeneralSettings";
import { useParticipant } from "../contexts/ParticipantContext";
import Participants from "./Participants";
import { useTeam } from "../contexts/TeamContext";
import Points from "./Points";
import ModalConfirmAction from "../components/modals/ModalConfirmAction";
import BottomNavbar from "../components/BottomNavbar";
import MyTeam from "./MyTeam";

function ViewLega() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { league, getLeague, updateLeague } = useLeague();
	const { deleteParticipant } = useParticipant();
	const { getMyTeam } = useTeam();
	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const { id, isAdmin } = state.league;
	const fileInputRef = useRef(null);
	const [randomColor, setRandomColor] = useState("#ffffff");

	const { name, status, icon, isRegistered } = league;
	const [tabActive, setTabActive] = useState();
	const [isModalConfirmOpen, setIsModalConfirmOpen] = useState({
		action: null,
		value: false,
	});
	const [dataModalConfirm, setDataModalConfirm] = useState({
		title: "",
		text: "",
		conferma: "",
		annulla: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			await getLeague(id);
			await getMyTeam(id);
			setIsLoading(false);
		};

		fetchData();
	}, [id]);

	const showModalConfirmDelete = () => {
		setDataModalConfirm({
			title: "Disiscrizione",
			text: "Confermando non parteciperai piú a questa lega.",
			conferma: "Conferma",
			annulla: "Annulla",
		});
		setIsModalConfirmOpen({ action: "delete", value: true });
	};

	useEffect(() => {
		setTabActive("General");
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
		setIsLoading(false);
		showPopup(
			"success",
			"Cancellazione effettuata!",
			"Non sei piú iscritto a questa lega."
		);
		setTimeout(() => {
			navigate("/app");
		}, 2000);
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

	const randomLightColor = () => {
		const getRandomValue = () => Math.floor(Math.random() * 128) + 128;
		const r = getRandomValue();
		const g = getRandomValue();
		const b = getRandomValue();
		return `#${r.toString(16).padStart(2, "0")}${g
			.toString(16)
			.padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};

	useEffect(() => {
		setRandomColor(randomLightColor());
	}, []);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className="flex flex-col gap-[16px] flex-1">
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
								className="relative w-full aspect-video rounded-[8px]"
								onClick={handleUpdateImage}
							>
								{icon == null ? (
									<div
										className={`w-full h-full rounded-[8px]`}
										style={{
											backgroundColor: randomColor,
										}}
									></div>
								) : (
									<img
										src={`data:image/png;base64,${icon}`}
										alt={`Logo lega`}
										className="w-full rounded-[8px] h-auto object-cover cursor-pointer"
									/>
								)}
								{status === "PENDING" && (
									<div className="absolute bottom-[8px] right-[8px] p-[10px] rounded-full bg-(--black-light)">
										<PencilSquareIcon className="h-[20px] w-[20px]" />
									</div>
								)}
							</picture>
							{status != "PENDING" && (
								<>
									<div className="flex items-center justify-between">
										{!(
											tabActive === "MyTeam" &&
											status === "NOT_STARTED"
										) && (
											<>
												<h2 className="title-h4 break-all">
													{name}
												</h2>
												{status == "NOT_STARTED" &&
													isRegistered && (
														<button
															className="flex items-center gap-[4px] body-small font-semibold text-[#F87171] whitespace-nowrap"
															onClick={
																showModalConfirmDelete
															}
														>
															Esci dalla lega
														</button>
													)}
											</>
										)}
									</div>
								</>
							)}
							{status === "PENDING" && (
								<Tab
									tabActive={tabActive}
									handleTabChange={handleTabChange}
								/>
							)}

							{tabActive === "General" && <GeneralSettings />}
							{tabActive === "Rules" && <Rules />}
							{tabActive === "Ranking" && <Ranking />}
							{tabActive === "Points" && <Points />}
							{tabActive === "Players" && <Players />}
							{tabActive === "Participants" && <Participants />}
							{tabActive === "MyTeam" && <MyTeam />}

							{status != "PENDING" && (
								<BottomNavbar
									tabActive={tabActive}
									handleTabChange={handleTabChange}
									isAdmin={isAdmin}
									status={status}
								/>
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
							dataModal={dataModalConfirm}
							onClose={() =>
								setIsModalConfirmOpen({
									action: null,
									value: false,
								})
							}
							onConfirmAction={handleRemovePartecipant}
						></ModalConfirmAction>
					</div>
				</>
			)}
		</>
	);
}

export default ViewLega;
