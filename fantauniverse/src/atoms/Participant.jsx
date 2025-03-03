import { UserCircleIcon } from "@heroicons/react/24/outline";

function Participant({ participant, handleClick }) {
	const { id, user, userPoints } = participant;

	return (
		<li
			role="button"
			tabIndex="0"
			className="flex gap-[8px] p-[8px] rounded-[8px] bg-(--black-light)"
			onClick={() => {
				handleClick(id);
			}}
		>
			<UserCircleIcon className="w-[24px] h-[24px]" />
			<h6>{user.username}</h6>
			<p>{userPoints}</p>
		</li>
	);
}

export default Participant;
