function Participant({ participant, handleClick, index }) {
	const { id, user, userPoints } = participant;

	return (
		<li
			role="button"
			tabIndex="0"
			className={`flex justify-between items-center p-[12px] rounded-lg text-white bg-(--black-normal)/70`}
			onClick={() => {
				handleClick(id);
			}}
		>
			<span className="font-bold">#{index + 1}</span>
			<span className="flex-1 text-center font-semibold">
				{user.username}
			</span>
			<span className="font-bold">{userPoints} pts</span>
		</li>
	);
}

export default Participant;
