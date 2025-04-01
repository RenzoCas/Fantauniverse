import {
	ChevronDownIcon,
	ChevronUpIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import { useEffect, useState } from "react";
import { Coins, SparklesIcon, SquareMinus, SquarePlus } from "lucide-react";
import { useUser } from "../contexts/UserContext";

function Player({
	playerObj,
	canEdit,
	createTeam,
	onEdit,
	canAdd,
	onSelect,
	onDeselect,
	onSelectCaptain,
	playersObj,
	playerActive,
	addPoints,
	dataDay,
	handleAddPoints,
	viewTeam = false,
	isCapitain = false,
	handleTabChange,
}) {
	const { name, price, points, icon, id } = playerObj;
	const { league } = useLeague();
	const { coinName, status } = league;
	const { user } = useUser();
	const isActive =
		playerActive || playersObj?.find((el) => el.id == playerObj.id);
	const isCurrentUser = playerObj.id == user.id;
	const [randomColor, setRandomColor] = useState("#ffffff");
	const [totalPoints, setTotalPoints] = useState(0);
	const [isExpanded, setIsExpanded] = useState(false);

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
		if (dataDay) {
			const singlePlayer = dataDay?.players.filter(
				(p) => p.player.id === id
			);
			setTotalPoints(() => singlePlayer[0]?.points);
		}

		setRandomColor(randomLightColor());
	}, []);

	const handleClickPlayer = () => {
		isCurrentUser
			? handleTabChange("MyTeam")
			: viewTeam
			? () => setIsExpanded(!isExpanded)
			: undefined;
	};

	return (
		<li
			className={`flex border-b border-(--black-light) pb-[8px] gap-[20px] transform transition-all duration-300`}
			onClick={() => handleClickPlayer()}
		>
			<picture
				className={`rounded-[3px] h-[38px] min-w-[38px] max-w-[38px] ${
					!createTeam
						? "opacity-100"
						: canAdd || isActive
						? "opacity-100"
						: "opacity-50"
				}`}
			>
				{icon == null ? (
					<div
						className={`rounded-[3px] h-[38px] w-[38px] object-cover`}
						style={{ backgroundColor: randomColor }}
					></div>
				) : (
					<img
						src={`data:image/png;base64,${icon}`}
						alt={`immagine player`}
						className="rounded-[3px] h-[38px] w-[38px] object-cover"
					/>
				)}
			</picture>
			{viewTeam ? (
				<>
					<p
						className={`text-(--black-darker) font-semibold break-all self-center`}
					>
						{name}
					</p>
					<div className="flex items-center gap-[8px] ml-auto">
						<p className="font-semibold text-(--black-darker) whitespace-nowrap">
							{points} pnt.
						</p>
						{isExpanded ? (
							<ChevronUpIcon className="h-[20px] w-[20px]" />
						) : (
							<ChevronDownIcon className="h-[20px] w-[20px]" />
						)}
					</div>
				</>
			) : (
				<div className={`flex flex-col gap-[4px] w-full`}>
					<p
						className={`font-semibold break-all ${
							!createTeam
								? "opacity-100"
								: canAdd || isActive
								? "opacity-100"
								: "opacity-50"
						}`}
					>
						{name}
					</p>
					{canEdit && status == "PENDING" ? (
						<p
							className={`body-small font-semibold text-(--black-normal) whitespace-nowrap`}
						>
							{price} {coinName}
						</p>
					) : status == "NOT_STARTED" ? (
						<div className="flex item-center gap-[10px]">
							<Coins className="stroke-(--black-light-active) w-[16px] h-[16px]" />
							<p
								className={`body-small font-light text-(--black-normal) whitespace-nowrap ${
									!createTeam
										? "opacity-100"
										: canAdd || isActive
										? "opacity-100"
										: "opacity-50"
								}`}
							>
								{price} {coinName}
							</p>
						</div>
					) : (
						<>
							{addPoints ? (
								<>
									<p className="body-small font-semibold text-(--black-normal) whitespace-nowrap">
										{points} pnt. totali
									</p>
									<p className="body-small font-semibold text-(--black-normal) whitespace-nowrap">
										{totalPoints || 0} pnt. giornata
									</p>
								</>
							) : (
								<p className="body-small font-semibold text-(--black-normal) whitespace-nowrap">
									{points} pnt.
								</p>
							)}
						</>
					)}
				</div>
			)}

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
						<div className="flex items-center gap-[20px]">
							<button onClick={() => onSelectCaptain(playerObj)}>
								<SparklesIcon
									className={`h-[24px] w-[24px] stroke-1 ${
										isCapitain ? "fill-[#DCC939]" : ""
									}`}
								/>
							</button>
							<button onClick={() => onDeselect(playerObj)}>
								<SquareMinus className="h-[24px] w-[24px] stroke-(--error-normal)" />
							</button>
						</div>
					) : (
						<button
							className={`flex self-center ${
								!canAdd && "opacity-50 cursor-not-allowed"
							}`}
							onClick={() => canAdd && onSelect(playerObj)}
							disabled={!canAdd}
						>
							<SquarePlus className="h-[24px] w-[24px]" />
						</button>
					)}
				</>
			)}
		</li>
	);
}

export default Player;
