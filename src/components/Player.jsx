import {
	MinusCircleIcon,
	PencilSquareIcon,
	PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import { useEffect, useState } from "react";

function Player({
	playerObj,
	canEdit,
	createTeam,
	onEdit,
	canAdd,
	onSelect,
	onDeselect,
	playersObj,
	playerActive,
	addPoints,
	dataDay,
	handleAddPoints,
}) {
	const { name, price, points, icon, id } = playerObj;
	const { league } = useLeague();
	const { coinName, status } = league;
	const isActive =
		playerActive || playersObj?.find((el) => el.id == playerObj.id);
	const [randomColor, setRandomColor] = useState("#ffffff");

	const singlePlayer = dataDay?.players.filter((p) => p.player.id === id);
	const totalPoints = singlePlayer[0]?.points;

	const randomLightColor = () => {
		const getRandomValue = () => Math.floor(Math.random() * 128) + 128;
		const r = getRandomValue();
		const g = getRandomValue();
		const b = getRandomValue();
		return `#${r.toString(16).padStart(2, "0")}${g
			.toString(16)
			.padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};

	useEffect(() => {
		setRandomColor(randomLightColor());
	}, []);

	return (
		<li
			className={`flex border-b border-(--black-light) pb-[8px] gap-[16px] transform transition-all duration-300 has-disabled:opacity-[0.5] ${
				isActive && "shadow-lg border p-[8px] rounded-[8px]"
			}`}
		>
			<picture className="rounded-full h-[40px] min-w-[40px] max-w-[40px] flex-shrink-1">
				{icon == null ? (
					<div
						className={`rounded-full h-[40px] w-[40px] object-cover`}
						style={{ backgroundColor: randomColor }}
					></div>
				) : (
					<img
						src={`data:image/png;base64,${icon}`}
						alt={`immagine giocatore`}
						className="rounded-full h-[40px] w-[40px] object-cover cursor-pointer"
					/>
				)}
			</picture>
			<div className={`flex flex-col gap-[4px] w-full`}>
				<p className="body-normal font-semibold break-words">{name}</p>
				{canEdit && status == "PENDING" ? (
					<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
						{price} {coinName}
					</p>
				) : status == "NOT_STARTED" ? (
					<>
						<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
							{price} {coinName}
						</p>
					</>
				) : (
					<>
						{addPoints ? (
							<>
								<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
									{points} pnt. totali
								</p>
								<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
									{totalPoints || 0} pnt. giornata
								</p>
							</>
						) : (
							<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
								{points} pnt.
							</p>
						)}
					</>
				)}
			</div>
			{canEdit && status == "PENDING" && (
				<button className="flex" onClick={() => onEdit(playerObj)}>
					<PencilSquareIcon className="h-[20px] w-[20px]" />
				</button>
			)}
			{addPoints && (
				<button
					className="flex"
					onClick={() => handleAddPoints(playerObj)}
				>
					<PencilSquareIcon className="h-[20px] w-[20px]" />
				</button>
			)}

			{createTeam && (
				<>
					{isActive ? (
						<button
							className="flex"
							onClick={() => onDeselect(playerObj)}
						>
							<MinusCircleIcon className="h-[20px] w-[20px]" />
						</button>
					) : (
						<button
							className={`flex ${
								!canAdd && "opacity-50 cursor-not-allowed"
							}`}
							onClick={() => canAdd && onSelect(playerObj)}
							disabled={!canAdd}
						>
							<PlusCircleIcon className="h-[20px] w-[20px]" />
						</button>
					)}
				</>
			)}
		</li>
	);
}

export default Player;
