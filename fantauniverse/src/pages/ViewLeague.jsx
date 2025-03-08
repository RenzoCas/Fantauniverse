import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
	ArrowLeftCircleIcon,
	CheckIcon,
	CloudArrowUpIcon,
	Cog6ToothIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../contexts/UserContext";
import { useLeague } from "../contexts/LeagueContext";
import Rules from "../pages/Rules";
import Tab from "../components/Tab";
import Ranking from "../pages/Ranking";
import CardSquadra from "../components/CardSquadra";
import Loader from "../components/Loader";
import ModalConfermDelete from "../components/modals/ModalConfirmDelete";
import NormalButton from "../atoms/Buttons/NormalButton";
import FixedPopup from "../components/popups/FixedPopup";
import Players from "./Players";
import ModalLeague from "../components/modals/ModalLeague";
import GenericPopup from "../components/popups/GenericPopup";

function ViewLega() {
	const navigate = useNavigate();
	const { state } = useLocation();

	const { user, urlServer } = useUser();
	const { league, getLeague, deleteLeague, addParticipant, updatedLeague } =
		useLeague();

	const [tabActive, setTabActive] = useState("Regolamento");
	const [team, setTeam] = useState();
	const [hasData, setHasData] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalConfirmDeleteOpen, setisModalConfirmDeleteOpen] =
		useState(false);
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
	const fileInputRef = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);

			try {
				await getLeague(id);
				const result = await fetch(`${urlServer}/league/myTeam/${id}`, {
					method: "GET",
					headers: { Authorization: `Bearer ${user.token}` },
				});

				if (!result.ok) {
					throw new Error("Errore nel recupero di squadra iscritta");
				}
				const data = await result.json();
				setTeam(data);
				setHasData(true);
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
		isRegistered,
		leagueInfoCompleted,
	} = league;
	const [icon, setIcon] = useState(league.icon);

	const handleTabChange = (tab) => {
		setTabActive(tab);
	};

	const handleClick = (participantId) => {
		navigate(`/app/league/team`, { state: { participantId } });
	};

	const handleStartLeague = () => {};

	const handleAddParticipant = () => {
		addParticipant(id);
	};

	const handleDeleteLeague = async () => {
		setIsLoading(true);
		await deleteLeague(id);
		setIsLoading(false);
		navigate("/app");
	};

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
		const file = event.target.files[0];
		if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
			const reader = new FileReader();
			reader.onloadend = async () => {
				const base64Image = reader.result.split(",")[1];
				setIcon(base64Image);
				const updatedLeagueData = { ...league, icon: base64Image };
				await updatedLeague(updatedLeagueData);
			};
			reader.readAsDataURL(file);
		} else {
			alert("Per favore seleziona un file JPEG o PNG.");
		}
	};

	const handleUpdateLeague = async () => {
		setIsModalOpen(true);
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
									navigate("/app");
								}}
								className="flex items-center gap-[4px] text-(--accent-normal)"
							>
								<ArrowLeftCircleIcon className="h-[24px] w-[24px]" />
								<p className="body-normal">Indietro</p>
							</button>
							{isAdmin && (
								<div className="flex items-center gap-[8px]">
									<button
										onClick={handleUpdateLeague}
										className="flex items-center gap-[4px] text-(--accent-normal)"
									>
										<p className="body-small">
											Modifica lega
										</p>
										<Cog6ToothIcon className="h-[24px] w-[24px]" />
									</button>
								</div>
							)}
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
							<picture className="relative w-full rounded-[8px]">
								<img
									src={
										icon != null
											? `data:image/png;base64,${icon}`
											: "https://placehold.co/361x217"
									}
									alt="Logo lega"
									className="w-full rounded-[8px]"
									onClick={handleUpdateImage}
									style={{ cursor: "pointer" }}
								/>
								<CloudArrowUpIcon className="absolute bottom-[16px] right-[16px] h-[32px] w-[32px]" />
							</picture>
							<div className="flex justify-between">
								<h2 className="title-h4">{name}</h2>
								{isAdmin && (
									<div className="flex gap-[8px] items-center">
										<p className="body-small whitespace-nowrap">
											Elimina lega
										</p>
										<button onClick={handleDeleteLeague}>
											<TrashIcon className="w-[24px] h-[24px]" />
										</button>
									</div>
								)}
							</div>
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
							{tabActive == "Regolamento" && <Rules />}
							{tabActive == "Classifica" && (
								<Ranking
									participants={participants}
									handleClick={handleClick}
								/>
							)}
							{tabActive == "Players" && <Players />}
						</div>
						{hasData &&
							(status === "PENDING" && leagueInfoCompleted ? (
								<NormalButton
									text="Pubblica lega"
									action={handleStartLeague}
									classOpt={"sticky bottom-[32px] mt-auto"}
								></NormalButton>
							) : status === "PENDING" && !leagueInfoCompleted ? (
								<FixedPopup background="(--error-light)">
									<CheckIcon className="w-[24px] h-[24px] flex-shrink-0" />
									<p className="font-bold text-(--black-normal)">
										Inserisci almeno una regola ed un player
										per poter pubblicare la lega
									</p>
								</FixedPopup>
							) : status === "NOT_STARTED" && isRegistered ? (
								<CardSquadra
									squadra={team}
									handleClick={handleClick}
									disabled={false}
								/>
							) : status === "NOT_STARTED" && !isRegistered ? (
								<NormalButton
									text="Unisciti alla lega"
									action={handleAddParticipant}
								></NormalButton>
							) : status === "STARTED" && isRegistered ? (
								<CardSquadra
									squadra={team}
									handleClick={handleClick}
									disabled={true}
								/>
							) : status === "STARTED" && !isRegistered ? (
								<FixedPopup background="(--error-light)">
									<CheckIcon className="w-[24px] h-[24px] flex-shrink-0" />
									<p className="font-bold text-(--black-normal)">
										Non puoi iscriverti, la lega è già
										avviata
									</p>
								</FixedPopup>
							) : null)}
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
					<ModalConfermDelete
						isOpen={isModalConfirmDeleteOpen}
						onClose={() => setisModalConfirmDeleteOpen(false)}
					>
						<p>prova</p>
					</ModalConfermDelete>
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
