import { TrashIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";

function Player({ playerObj, onDelete, isAdmin }) {
	const { id, name, price, points } = playerObj;
	const { league } = useLeague();
	const { coinName } = league;

	return (
		<li className={`flex flex-col rounded-[8px] border shadow-lg`}>
			<div className="flex justify-end py-[8px] px-[16px] border-b border-b-(--black-light-hover)">
				<p className="body-small font-semibold text-(--black-normal)">
					<span className="font-bold">{price} </span>
					{coinName}
				</p>
			</div>
			<div className="flex gap-[16px] py-[8px] px-[16px] items-center">
				<div className="flex gap-[8px]">
					<p className="font-bold body-normal">{name}</p>
					<p
						className={`body-normal ${
							points < 0 && "text-(--error-normal)"
						}`}
					>
						{points >= 0 ? points : `-${points}`}
					</p>
				</div>
				{isAdmin && (
					<button onClick={() => onDelete(id)} className="ml-auto">
						<TrashIcon className="w-[24px] h-[24px]" />
					</button>
				)}
			</div>
		</li>
	);
}

export default Player;
