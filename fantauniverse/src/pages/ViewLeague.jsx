import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
	ArrowLeftCircleIcon,
	// CloudArrowUpIcon,
	// Cog6ToothIcon,
	PencilSquareIcon,
	// TrashIcon,
	// XMarkIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../contexts/UserContext";
import { useLeague } from "../contexts/LeagueContext";
import Rules from "../pages/Rules";
import Tab from "../components/Tab";
import Ranking from "../pages/Ranking";
// import CardSquadra from "../components/CardSquadra";
import Loader from "../components/Loader";
// import ModalConfirmAction from "../components/modals/ModalConfirmAction";
// import NormalButton from "../atoms/Buttons/NormalButton";
// import FixedPopup from "../components/popups/FixedPopup";
import Players from "./Players";
import ModalLeague from "../components/modals/ModalLeague";
import GenericPopup from "../components/popups/GenericPopup";
import GeneralSettings from "./GeneralSettings";

function ViewLega() {
	const navigate = useNavigate();
	const { state } = useLocation();

	const { user, urlServer } = useUser();
	const { league, getLeague, updateLeague } = useLeague();

	// const [team, setTeam] = useState();
	// const [hasData, setHasData] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// const [isModalConfirmAction, setIsModalConfirmAction] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const initialState = {
		id: league.id,
		name: league.name,
		description: league.description,
		visibility: league.visibility,
		coinName: league.coinName,
		maxCoins: league.maxCoins,
	};
	const { id, isAdmin } = state.league;
	const [tabActive, setTabActive] = useState(
		`${isAdmin ? "General" : "Rules"}`
	);
	const fileInputRef = useRef(null);
	// const [textConfirmAction, setTextConfirmAction] = useState("");
	// const [confirmAction, setConfirmAction] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);

			try {
				await getLeague(id);
				// const result = await fetch(`${urlServer}/league/myTeam/${id}`, {
				// 	method: "GET",
				// 	headers: { Authorization: `Bearer ${user.token}` },
				// });

				// if (!result.ok) {
				// 	throw new Error("Errore nel recupero di squadra iscritta");
				// }
				// const data = await result.json();
				// setTeam(data);
				// setHasData(true);
			} catch (error) {
				console.error(error.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [getLeague, user.token, urlServer, id]);

	const {
		description,
		name,
		participants,
		status,
		// isRegistered,
		// leagueInfoCompleted,
		icon,
	} = league;

	const handleTabChange = (tab) => {
		setTabActive(tab);
	};

	const handleClick = (participantId) => {
		navigate(`/app/league/team`, { state: { participantId } });
	};

	// const handlePublishLeague = () => {
	// 	setTextConfirmAction("Sei sicuro di voler eliminare la lega?");
	// 	setConfirmAction(() => handleUpdateStatusLeague);
	// 	setIsModalConfirmAction(true);
	// };

	// const handleUpdateStatusLeague = () => {};

	// const handleAddParticipant = () => {
	// 	addParticipant(id);
	// };

	// const handleDeleteLeagueClick = () => {
	// 	setConfirmAction(() => handleDeleteLeague);
	// 	setTextConfirmAction("Sei sicuro di voler eliminare la lega?");
	// 	setIsModalConfirmAction(true);
	// };

	// const handleDeleteLeague = async () => {
	// 	setIsLoading(true);
	// 	await deleteLeague(id);
	// 	setIsLoading(false);
	// 	navigate("/app");
	// };

	const handleUpdateImage = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const showPopup = (type, message) => {
		setPopupData({ isOpen: true, type, message });
		setTimeout(() => setPopupData({ isOpen: false, type, message }), 1000);
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
					const updatedLeagueData = { ...league, icon: base64Image };
					setIsLoading(true);
					await updateLeague(updatedLeagueData);
					await getLeague(id);
					setIsLoading(false);
				};
				reader.readAsDataURL(file);
			} else {
				throw new Error("Per favore seleziona un file JPEG o PNG.");
			}
		} catch (error) {
			alert(error.message);
		}
	};

	// const handleUpdateLeague = async () => {
	// 	setIsModalOpen(true);
	// };

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
									navigate("/app");
								}}
								className="flex items-center gap-[4px] text-(--accent-normal)"
							>
								<ArrowLeftCircleIcon className="h-[24px] w-[24px]" />
								<p className="body-normal">Indietro</p>
							</button>
						</div>
						<div className="top flex flex-col gap-[16px]">
							<input
								type="file"
								name="logo"
								id="logoLega"
								accept="image/jpeg, image/png"
								onChange={handleFileChange}
								ref={fileInputRef}
								className="hidden"
							/>
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
									className="w-full rounded-[8px] w-full h-auto object-cover"
									style={{ cursor: "pointer" }}
								/>
								<div className="absolute bottom-[8px] right-[8px] p-[10px] rounded-full bg-(--black-light)">
									<PencilSquareIcon className="h-[20px] w-[20px]" />
								</div>
							</picture>
							{/* <div className="flex justify-between">
								
							</div> */}
							<h2 className="title-h4">{name}</h2>
							{description != null && (
								<p className="body-small text-(--black-normal)">
									{description}
								</p>
							)}

							<Tab
								tabActive={tabActive}
								handleTabChange={handleTabChange}
								isAdmin={isAdmin}
								status={status}
							/>
							{tabActive === "General" && <GeneralSettings />}
							{tabActive === "Rules" && <Rules />}
							{tabActive === "Ranking" && (
								<Ranking
									participants={participants}
									handleClick={handleClick}
								/>
							)}
							{tabActive === "Points" && <p>punti</p>}
							{tabActive === "Players" && <Players />}
						</div>
						{/* {hasData && status === "STARTED" && isRegistered ? (
							<CardSquadra
								squadra={team}
								handleClick={handleClick}
								disabled={true}
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
						)} */}
					</div>
					<ModalLeague
						isOpen={isModalOpen}
						onClose={async () => {
							setIsModalOpen(false);
							await getLeague(id);
						}}
						onCreate={showPopup}
						initialState={initialState}
					/>
					{/* <ModalConfirmAction
						isOpen={isModalConfirmAction}
						onClose={() => setIsModalConfirmAction(false)}
						onConfirmAction={confirmAction}
						textConfirmAction={textConfirmAction}
					></ModalConfirmAction> */}
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

export default ViewLega;
