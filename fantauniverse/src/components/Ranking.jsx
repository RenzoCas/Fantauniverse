import Participant from "../atoms/Participant";

function Ranking({ participants, handleClick }) {
	return (
		<ul className="flex flex-col gap-[16px]">
			{participants.map((el, idx) => (
				<Participant
					key={el.id}
					participant={el}
					handleClick={handleClick}
					index={idx}
				/>
			))}
		</ul>
	);
}

export default Ranking;
