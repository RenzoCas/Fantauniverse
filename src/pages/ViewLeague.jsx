import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
import Logo from "../atoms/Logo";
import { Bell, ChevronLeft } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import NotificationComponent from "../components/Notification";
import { useNotification } from "../contexts/NotificationContext";
import { useModal } from "../contexts/ModalContext";
import FocusModal from "../hooks/FocusModal";

function ViewLega() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { getUrlImage } = useUser();
	const { league, getLeague, uploadImage } = useLeague();
	const { deleteParticipant } = useParticipant();
	const { teamParticipant } = useTeam();
	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const fileInputRef = useRef(null);
	const [randomColor, setRandomColor] = useState("#ffffff");
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
	const [isNotifyVisible, setIsNotifyVisible] = useState(false);
	const { unreadCountNotifications } = useNotification();
	const { openBackdrop, closeBackdrop } = useModal();
	const notifyRef = useRef(null);
	FocusModal(notifyRef, isNotifyVisible);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			await getLeague(id);
			setIsLoading(false);
		};

		fetchData();
	}, [id]);

	const { name, description, status, iconUrl, isRegistered, isAdmin } =
		league;

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
				!file ||
				!(file.type === "image/jpeg" || file.type === "image/png")
			) {
				throw new Error("Per favore seleziona un file JPEG o PNG.");
			}

			setIsLoading(true);

			const filename = `${file.name}`;
			const response = await getUrlImage({
				id: id,
				fileName: filename,
				referredTo: "LEAGUE",
			});

			if (!response) {
				showPopup(
					"error",
					"Errore nell'aggiornamento dell'immagine!",
					"Immagine non caricata correttamente. Riprova."
				);
				return;
			}

			await uploadImage(file, response);

			showPopup(
				"success",
				"Aggiornamento completato!",
				"Immagine modificata correttamente."
			);
		} catch (error) {
			console.error(
				"Errore durante il caricamento dell'immagine:",
				error
			);
		} finally {
			setIsLoading(false);
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

	useEffect(() => {
		if (isNotifyVisible) {
			openBackdrop();
		} else {
			closeBackdrop();
		}
	}, [isNotifyVisible]);

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				if (isNotifyVisible) {
					setIsNotifyVisible(false);
				}
			}
		};

		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [isNotifyVisible]);

	const toggleNotify = () => {
		setIsNotifyVisible(!isNotifyVisible);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div
						className={`hidden lg:fixed lg:top-[8px] lg:left-[370px] lg:flex lg:w-full lg:items-center lg:px-[20px] lg:py-[20px] lg:border-b-2 lg:border-b-solid lg:border-b-(--black-light-hover) lg:max-w-[calc(100vw-370px)] ${
							status == "PENDING" ? "lg:justify-between" : ""
						}`}
					>
						<Logo />
						{status != "PENDING" && (
							<BottomNavbar
								tabActive={tabActive}
								handleTabChange={handleTabChange}
								isAdmin={isAdmin}
								status={status}
								classOpt="hidden lg:flex md:mx-auto lg:static lg:mt-0 lg:gap-[22px]"
							/>
						)}
						<button
							onClick={toggleNotify}
							className="cursor-pointer relative h-fit"
						>
							<Bell className="h-[24px] w-[24px] flex-shrink-0" />
							{unreadCountNotifications > 0 && (
								<>
									<span className="absolute inline-flex w-[8px] h-[8px] animate-ping rounded-full bg-(--error-normal)/80 opacity-75 top-0 right-[2px]"></span>
									<span className="absolute inline-flex w-[8px] h-[8px] rounded-full bg-(--error-normal) top-0 right-[2px]"></span>
								</>
							)}
						</button>
					</div>
					<div
						ref={notifyRef}
						className={`fixed top-0 right-0 h-full w-[370px] bg-white shadow-lg transform transition-transform duration-500 flex flex-col flex-1 z-100 overflow-y-auto ${
							isNotifyVisible
								? "translate-x-0"
								: "translate-x-full"
						}`}
					>
						<div className="flex flex-col gap-[10px] sticky top-0 bg-white z-1 p-[16px] lg:p-[24px]">
							<div className="flex items-center justify-between gap-[8px]">
								<div className="flex flex-col">
									<p className="body-small">
										Gestisci le tue notifiche
									</p>
									<h3 className="body-normal font-medium">
										Centro notifiche
									</h3>
								</div>
								<button
									onClick={toggleNotify}
									className="p-[8px] rounded-[4px] border border-solid border-(--black-light) cursor-pointer"
								>
									<XMarkIcon className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
								</button>
							</div>
							<div className="h-[1px] w-full border-t border-t-solid border-t-(--black-light-active)"></div>
						</div>
						<div className="flex flex-col gap-[10px] flex-1 pb-[16px] px-[16px] lg:pb-[24px] lg:px-[24px]">
							<NotificationComponent
								onClose={() =>
									setIsNotifyVisible(!isNotifyVisible)
								}
							/>
						</div>
					</div>
					<button
						className="flex items-center gap-[10px] w-full p-[10px] bg-(--black-light) body-normal lg:hidden fixed top-[64px] left-0 z-10 cursor-pointer"
						onClick={() => navigate("/app")}
					>
						<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
						Torna alla dashboard
					</button>
					<section className="flex flex-col gap-[16px] h-full pt-[44px] lg:pt-0 lg:max-w-[840px] lg:mx-auto">
						<div className="top flex flex-col gap-[16px] flex-1">
							<div className="flex justify-center lg:items-center lg:gap-[20px]">
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
									className="relative w-full max-w-[371px] h-[271px] aspect-video flex-shrink-1 overflow-hidden rounded-[8px] cursor-pointer"
									onClick={handleUpdateImage}
								>
									{iconUrl == null ? (
										<div
											className={`w-full h-full object-cover rounded-[8px]`}
											style={{
												backgroundColor: randomColor,
											}}
										></div>
									) : (
										<img
											src={`${iconUrl}`}
											alt={`Logo lega`}
											className="w-full rounded-[8px] h-full object-cover"
											loading="lazy"
										/>
									)}
									{status === "PENDING" && (
										<button className="absolute bottom-[8px] right-[8px] p-[10px] rounded-full bg-(--black-light)">
											<PencilSquareIcon className="h-[20px] w-[20px]" />
										</button>
									)}
								</picture>
								<div className="hidden lg:flex lg:flex-col lg:gap-[8px] lg:w-full">
									<div className="items-center justify-between hidden lg:flex lg:gap-[8px] lg:w-full">
										<h2 className="title-h4 font-medium break-all">
											{name}
										</h2>
										{status == "NOT_STARTED" &&
											isRegistered && (
												<button
													className="flex items-center gap-[4px] body-small font-semibold text-[#F87171] whitespace-nowrap cursor-pointer"
													onClick={
														showModalConfirmDelete
													}
												>
													Esci dalla lega
												</button>
											)}
									</div>
									{description && <p>{description}</p>}
								</div>
							</div>
							{status != "PENDING" && (
								<>
									{!(
										tabActive === "MyTeam" ||
										tabActive === "Points" ||
										teamParticipant
									) && (
										<div className="flex items-center justify-between lg:hidden">
											<h2 className="title-h4 font-medium break-all">
												{name}
											</h2>
											{status == "NOT_STARTED" &&
												isRegistered && (
													<button
														className="flex items-center gap-[4px] body-small font-semibold text-[#F87171] whitespace-nowrap cursor-pointer"
														onClick={
															showModalConfirmDelete
														}
													>
														Esci dalla lega
													</button>
												)}
										</div>
									)}
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
							{tabActive === "Ranking" && (
								<Ranking handleTabChange={handleTabChange} />
							)}
							{tabActive === "Points" && <Points />}
							{tabActive === "Players" && <Players />}
							{tabActive === "Participants" && (
								<Participants
									handleTabChange={handleTabChange}
								/>
							)}

							{tabActive === "MyTeam" && <MyTeam />}

							{status != "PENDING" && (
								<BottomNavbar
									tabActive={tabActive}
									handleTabChange={handleTabChange}
									isAdmin={isAdmin}
									status={status}
									classOpt="lg:hidden"
								/>
							)}
						</div>
						<GenericPopup
							isOpen={popupData.isOpen}
							type={popupData.type}
							title={popupData.title}
							message={popupData.message}
						/>
						{status == "NOT_STARTED" && isRegistered && (
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
							/>
						)}
					</section>
				</>
			)}
		</>
	);
}

export default ViewLega;
