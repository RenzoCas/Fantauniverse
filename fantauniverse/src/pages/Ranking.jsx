import { useNavigate } from "react-router";
import Participant from "../components/Participant";
import { useLeague } from "../contexts/LeagueContext";
import { useTeam } from "../contexts/TeamContext";

function Ranking() {
	const { league } = useLeague();
	const { getTeam } = useTeam();
	const { participants } = league;
	const navigate = useNavigate();

	const handleClick = async (participantId) => {
		await getTeam(participantId);
		navigate("viewTeam");
	};
	return (
		<ul className="flex flex-col gap-[16px]">
			{participants.map((el, idx) => (
				<Participant
					key={idx}
					participantObj={el}
					idx={idx}
					isRanking={true}
					handleClick={handleClick}
				/>
			))}
		</ul>
	);
}

export default Ranking;
