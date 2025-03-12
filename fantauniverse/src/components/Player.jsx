import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";

function Player({ playerObj, canEdit, onEdit }) {
	const { name, price, points, icon } = playerObj;
	const { league } = useLeague();
	const { coinName, status } = league;

	return (
		<li className="flex border-b border-(--black-light) pb-[8px] gap-[16px]">
			<picture className="rounded-full h-[40px] min-w-[40px] max-w-[40px] flex-shrink-1">
				<img
					src={
						icon != null
							? `data:image/png;base64,${icon}`
							: "https://placehold.co/40x40"
					}
					alt="immagine giocatore"
					className="rounded-full h-[40px] w-[40px] object-cover"
					style={{ cursor: "pointer" }}
				/>
			</picture>
			<div className={`flex flex-col gap-[4px] w-full`}>
				<p className="body-normal font-semibold">{name}</p>
				{canEdit && status == "PENDING" ? (
					<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
						{price} {coinName}
					</p>
				) : (
					<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
						{points} ptn.
					</p>
				)}
			</div>
			{canEdit && status == "PENDING" && (
				<button className="flex" onClick={() => onEdit(playerObj)}>
					<PencilSquareIcon className="h-[20px] w-[20px]" />
				</button>
			)}
		</li>
	);
}

export default Player;
