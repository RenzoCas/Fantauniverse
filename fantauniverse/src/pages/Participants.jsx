import { useLeague } from "../contexts/LeagueContext";
import Participant from "../components/Participant";

function Participants() {
	const { league } = useLeague();
	const { participants } = league;

	return (
		<>
			{participants.length > 0 ? (
				<>
					<h6 className="body-regular font-semibold">
						Giocatori iscritti alla lega
					</h6>
					<ul className="flex flex-col gap-[16px]">
						{participants.map((el, idx) => (
							<Participant key={idx} participantObj={el} />
						))}
					</ul>
				</>
			) : (
				<p className="body-normal font-semibold text-(--black-darker) text-center">
					Nessun giocatore &egrave; ancora iscritto a questa lega.
				</p>
			)}
		</>
	);
}

export default Participants;
