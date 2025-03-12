import Participant from "../components/Participant";
import { useLeague } from "../contexts/LeagueContext";

function Ranking() {
	const { league } = useLeague();
	const { participants } = league;
	return (
		<ul className="flex flex-col gap-[16px]">
			{participants.map((el, idx) => (
				<Participant
					key={idx}
					participantObj={el}
					idx={idx}
					isRanking={true}
				/>
			))}
		</ul>
	);
}

export default Ranking;
