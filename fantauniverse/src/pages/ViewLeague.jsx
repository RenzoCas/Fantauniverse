import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { BoltIcon, TrashIcon } from "@heroicons/react/24/outline";
import Rules from "../components/Rules";
import Tab from "../components/Tab";
import Ranking from "../components/Ranking";
import CardSquadra from "../atoms/CardSquadra";

function ViewLega() {
	const { user, urlServer } = useAuth();
	const { state } = useLocation();
	const navigate = useNavigate();
	const [tabActive, setTabActive] = useState("Regolamento");
	const [team, setTeam] = useState();
	const [hasData, setHasData] = useState(false);
	const {
		id,
		name,
		icon,
		admin,
		rules,
		participants,
		status,
		registered,
		description,
	} = state.lega;
	const isAdmin = admin.id == user.id;
	const [newRules, setNewRules] = useState(rules);

	useEffect(() => {
		const getSquadra = async () => {
			try {
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
			}
		};

		getSquadra();
	}, [user.token, urlServer, id]);

	if (!state?.lega) {
		return <h1>Errore: lega non trovata.</h1>;
	}

	const handleTabChange = (tab) => {
		setTabActive(tab);
	};

	const handleClick = (participantId) => {
		navigate(`/app/league/team`, { state: { participantId } });
	};

	return (
		<div className="flex flex-col gap-[16px] justify-between h-full flex-1">
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
							<p className="body-small">Elimina lega</p>
							<button onClick={() => {}}>
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
					<Rules
						rules={newRules}
						leagueId={id}
						isAdmin={isAdmin}
						setNewRules={setNewRules}
					/>
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
						onClick={() => alert("ciao")}
						className="group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-white bg-(--accent-normal)"
					>
						<span>Unisciti alla lega</span>
						<BoltIcon className="h-[24px] w-[24px] text-(--black-normal) bg-white p-[4px] rounded-full" />
					</button>
				) : status == "NOT_STARTED" && registered ? (
					<CardSquadra squadra={team} handleClick={handleClick} />
				) : (
					status == "STARTED" &&
					registered && (
						<CardSquadra squadra={team} handleClick={handleClick} />
					)
				))}
		</div>
	);
}

export default ViewLega;
