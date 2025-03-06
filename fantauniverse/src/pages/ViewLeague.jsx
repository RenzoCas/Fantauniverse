import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import {
	ArrowLeftCircleIcon,
	BoltIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import Rules from "../components/Rules";
import Tab from "../components/Tab";
import Ranking from "../components/Ranking";
import CardSquadra from "../atoms/CardSquadra";
import Loader from "../components/Loader";
import { useLeague } from "../contexts/LeagueContext";

function ViewLega() {
	const navigate = useNavigate();
	const { state } = useLocation();

	const { user, urlServer } = useUser();
	const { league, getLeague, deleteLeague, addParticipant } = useLeague();

	const [tabActive, setTabActive] = useState("Regolamento");
	const [team, setTeam] = useState();
	const [hasData, setHasData] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { id, admin } = state;
	const isAdmin = admin.id == user.id;

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

	const { icon, description, name, participants, status, registered } =
		league;

	const handleTabChange = (tab) => {
		setTabActive(tab);
	};

	const handleClick = (participantId) => {
		navigate(`/app/league/team`, { state: { participantId } });
	};

	const handleAddParticipant = () => {
		addParticipant(id);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
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
						<img
							src={icon || "https://placehold.co/361x217"}
							alt="Logo lega"
							className="w-full rounded-[8px]"
						/>
						<div className="flex justify-between">
							<h2 className="title-h4">{name}</h2>
							{isAdmin && (
								<div className="flex gap-[8px] items-center">
									<p className="body-small whitespace-nowrap">
										Elimina lega
									</p>
									<button
										onClick={() => {
											deleteLeague(id);
											navigate("/app");
										}}
									>
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
						{tabActive == "Admin" && <p>admin</p>}
					</div>
					{hasData &&
						(status == "NOT_STARTED" && !registered ? (
							<button
								onClick={handleAddParticipant}
								className="group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-white bg-(--accent-normal)"
							>
								<span>Unisciti alla lega</span>
								<BoltIcon className="h-[24px] w-[24px] text-(--black-normal) bg-white p-[4px] rounded-full" />
							</button>
						) : status == "NOT_STARTED" && registered ? (
							<CardSquadra
								squadra={team}
								handleClick={handleClick}
							/>
						) : status == "STARTED" && registered ? (
							<CardSquadra
								squadra={team}
								handleClick={handleClick}
								disabled={true}
							/>
						) : (
							status == "STARTED" &&
							!registered && (
								<p>
									Non puoi iscriverti, la lega é giá avviata
								</p>
							)
						))}
				</div>
			)}
		</>
	);
}

export default ViewLega;
