import { useLeague } from "../contexts/LeagueContext";
import Participant from "../components/Participant";

function Participants({ handleTabChange }) {
	const { league } = useLeague();
	const { participants } = league;

	return (
		<>
			{participants.length > 0 ? (
				<ul className="flex flex-col gap-[8px]">
					{participants.map((el, idx) => (
						<Participant
							key={idx}
							participantObj={el}
							handleTabChange={handleTabChange}
						/>
					))}
				</ul>
			) : (
				<p className="body-normal font-semibold text-(--black-darker) text-center">
					Nessun giocatore &egrave; ancora iscritto a questa lega.
				</p>
			)}
		</>
	);
}

export default Participants;
