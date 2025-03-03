import Participant from "../atoms/Participant";

function Ranking({ participants, handleClick }) {
	return (
		<ul className="flex flex-col gap-[16px]">
			{participants.map((el) => (
				<Participant
					key={el.id}
					participant={el}
					handleClick={handleClick}
				/>
			))}
		</ul>
	);
}

export default Ranking;
