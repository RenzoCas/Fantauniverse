import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";

function Player({ playerObj, canEdit, onEdit }) {
	const { name, price, points } = playerObj;
	const { league } = useLeague();
	const { coinName, status } = league;

	return (
		<li className="flex border-b border-(--black-light) pb-[8px] gap-[20px]">
			{canEdit && status == "PENDING" && (
				<button className="flex" onClick={() => onEdit(playerObj)}>
					<PencilSquareIcon className="h-[20px] w-[20px]" />
				</button>
			)}
			<div className={`flex gap-[8px] w-full`}>
				<img
					src="https://placehold.co/40x40"
					alt=""
					className="rounded-full"
				/>
				<p className="body-normal font-semibold flex self-center">
					{name}
				</p>
				{canEdit && status == "PENDING" ? (
					<p className="body-small font-semibold whitespace-nowrap ml-auto">
						{price} {coinName}
					</p>
				) : (
					<p className="body-small font-semibold whitespace-nowrap ml-auto">
						{points} ptn.
					</p>
				)}
			</div>
		</li>
	);
}

export default Player;
