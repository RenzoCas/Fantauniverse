import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import {
	ArrowLeftCircleIcon,
	CheckIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import Rules from "../components/Rules";
import Tab from "../components/Tab";
import Ranking from "../components/Ranking";
import CardSquadra from "../components/CardSquadra";
import Loader from "../components/Loader";
import { useLeague } from "../contexts/LeagueContext";
import ModalConfermDelete from "../components/modals/ModalConfirmDelete";
import NormalButton from "../atoms/Buttons/NormalButton";
import FixedPopup from "../components/popups/FixedPopup";

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

	const { id, isAdmin, leagueInfoCompleted } = state.league;

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

	const { description, name, participants, status, isRegistered } = league;
	const [icon, setIcon] = useState(league.icon || null);

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

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
			const reader = new FileReader();
			reader.onloadend = async () => {
				// Rimuovi il prefisso 'data:image/jpeg;base64,' dalla stringa
				const base64Image = reader.result.split(",")[1];

				// Imposta l'icon solo con la parte del base64
				setIcon(base64Image);

				// Crea i dati aggiornati della lega
				const updatedLeagueData = { ...league, icon: base64Image };

				// Invia i dati aggiornati al contesto o al server
				await updatedLeague(updatedLeagueData);
			};
			reader.readAsDataURL(file);
		} else {
			alert("Per favore seleziona un file JPEG o PNG.");
		}
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className="flex flex-col gap-[16px] justify-between h-full flex-1">
						<button
							onClick={() => {
								navigate("/app");
							}}
							className="flex items-center gap-[4px] body-normal text-(--accent-normal)"
						>
							<ArrowLeftCircleIcon className="h-[24px] w-[24px]" />
							Indietro
						</button>
						<div className="top flex flex-col gap-[16px]">
							<input
								type="file"
								name="logo"
								id="logoLega"
								accept="image/jpeg, image/png"
								onChange={handleFileChange}
								style={{ display: "none" }}
							/>
							<img
								src={
									icon != null
										? icon
										: "https://placehold.co/361x217"
								}
								alt="Logo lega"
								className="w-full rounded-[8px]"
								onClick={() =>
									document.getElementById("logoLega").click()
								}
								style={{ cursor: "pointer" }}
							/>
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
							{tabActive == "Regolamento" && (
								<Rules isAdmin={isAdmin} />
							)}
							{tabActive == "Classifica" && (
								<Ranking
									participants={participants}
									handleClick={handleClick}
								/>
							)}
							{tabActive == "Admin" && (
								<>
									<p>admin</p>
								</>
							)}
						</div>
						{hasData &&
							(status === "PENDING" && leagueInfoCompleted ? (
								<NormalButton
									text="Pubblica lega"
									action={handleStartLeague}
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
					<ModalConfermDelete
						isOpen={isModalConfirmDeleteOpen}
						onClose={() => setisModalConfirmDeleteOpen(false)}
					>
						<p>prova</p>
					</ModalConfermDelete>
				</>
			)}
		</>
	);
}

export default ViewLega;
