import Participant from "../components/Participant";
import { useLeague } from "../contexts/LeagueContext";
import { useTeam } from "../contexts/TeamContext";
import { Award } from "lucide-react";
import Player from "../components/Player";

function Ranking({ handleTabChange }) {
	const { league } = useLeague();
	const { getTeam, teamParticipant, resetTeamPartecipant } = useTeam();
	const { participants } = league;

	const handleClick = async (participantId) => {
		await getTeam(participantId);
	};

	const resetParticipant = async () => {
		await resetTeamPartecipant();
	};

	return (
		<>
			{teamParticipant ? (
				<>
					<div className="flex flex-col gap-[24px]">
						<div className="flex items-start justify-between gap-[8px]">
							<div className="flex flex-col gap-[8px]">
								<h2 className="title-h4 font-medium break-all">
									{teamParticipant.name}
								</h2>
								<div className="flex items-center gap-[10px]">
									<Award className="h-[24px] w-[24px] stroke-[#B01DFF] flex-shrink-0" />
									<p className="body-regular">
										{teamParticipant.position}o Posto
									</p>
								</div>
							</div>
							<button
								onClick={resetParticipant}
								className="body-small font-semibold cursor-pointer"
							>
								Torna alla classifica
							</button>
						</div>

						<div className="flex flex-col gap-[8px]">
							{teamParticipant.players.map((p, idx) => (
								<Player
									key={p.id}
									playersObj={teamParticipant.players}
									playerObj={p}
									viewTeam={true}
									playerDay={teamParticipant.playerDay[idx]}
								/>
							))}
						</div>
					</div>
				</>
			) : (
				<div className="flex flex-col gap-[16px]">
					{participants.map((el, idx) => (
						<Participant
							key={idx}
							participantObj={el}
							idx={idx}
							isRanking={true}
							handleClick={handleClick}
							handleTabChange={handleTabChange}
						/>
					))}
				</div>
			)}
		</>
	);
}

export default Ranking;
