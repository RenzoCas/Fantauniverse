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
	playerDay,
	playerActive,
	addPoints,
	dataDay,
	handleAddPoints,
	viewTeam = false,
	handleTabChange,
}) {
	const { name, price, points, icon } = playerObj;
	const { league } = useLeague();
	const { coinName, status, enableCaptain } = league;
	const { user } = useUser();
	const isActive =
		playerActive || playersObj?.find((el) => el.id == playerObj.id);
	const isCurrentUser = playerObj.id == user.id;
	const isCaptain = playersObj?.some(
		(p) => p.id === playerObj.id && p.isCaptain
	);
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
		setTotalPoints(() => dataDay?.points);
		setRandomColor(randomLightColor());
	}, []);

	const handleClickPlayer = () => {
		isCurrentUser
			? handleTabChange("MyTeam")
			: viewTeam
			? setIsExpanded(!isExpanded)
			: undefined;
	};

	return (
		<>
			{viewTeam ? (
				<li
					className={`flex flex-col gap-[8px] border-b border-(--black-light) pb-[8px] transform transition-all duration-300`}
					onClick={() => handleClickPlayer()}
				>
					<div className="flex gap-[20px]">
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
						<p
							className={`body-normal font-semibold text-(--black-darker) break-all self-center`}
						>
							{name}
						</p>
						<div className="flex items-center gap-[8px] ml-auto">
							<p className="body-normal font-semibold text-(--black-darker) whitespace-nowrap">
								{points} pnt.
							</p>
							{playerDay?.dayPoints.length > 0 && (
								<>
									{isExpanded ? (
										<ChevronUpIcon className="h-[20px] w-[20px]" />
									) : (
										<ChevronDownIcon className="h-[20px] w-[20px]" />
									)}
								</>
							)}
						</div>
					</div>
					{isExpanded && playerDay?.dayPoints.length > 0 && (
						<ul className="flex flex-col gap-[8px]">
							{playerDay.dayPoints.map((pd, idx) => (
								<li
									key={idx}
									className="flex items-center justify-between w-full"
								>
									<p className="body-normal font-semibold flex flex-1">
										{pd.day?.name}
									</p>
									<p className="body-normal font-semibold whitespace-nowrap">
										{pd.points} pnt.
									</p>
								</li>
							))}
						</ul>
					)}
				</li>
			) : (
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
					<div className={`flex flex-col gap-[4px] w-full`}>
						<p
							className={`body-normal font-semibold break-all ${
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
						) : status == "NOT_STARTED" || status === "STARTED" ? (
							<>
								{addPoints ? (
									<>
										<p className="body-small font-semibold text-(--black-normal) whitespace-nowrap">
											{totalPoints || 0} pnt.
										</p>
									</>
								) : (
									<div className="flex item-center gap-[10px]">
										<Coins className="stroke-(--black-light-active) w-[16px] h-[16px] flex-shrink-0" />
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
								)}
							</>
						) : (
							<p className="body-small font-semibold text-(--black-normal) whitespace-nowrap">
								{points} pnt.
							</p>
						)}
					</div>

					{canEdit && status == "PENDING" && (
						<button
							className="flex"
							onClick={() => onEdit(playerObj)}
						>
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
									{enableCaptain && (
										<button
											onClick={() =>
												onSelectCaptain(playerObj)
											}
										>
											<SparklesIcon
												className={`h-[24px] w-[24px] stroke-1 flex-shrink-0 ${
													isCaptain
														? "fill-[#DCC939]"
														: ""
												}`}
											/>
										</button>
									)}

									<button
										onClick={() => onDeselect(playerObj)}
									>
										<SquareMinus className="h-[24px] w-[24px] stroke-(--error-normal) flex-shrink-0" />
									</button>
								</div>
							) : (
								<button
									className={`flex self-center ${
										!canAdd &&
										"opacity-50 cursor-not-allowed"
									}`}
									onClick={() =>
										canAdd && onSelect(playerObj)
									}
									disabled={!canAdd}
								>
									<SquarePlus className="h-[24px] w-[24px] flex-shrink-0" />
								</button>
							)}
						</>
					)}
				</li>
			)}
		</>
	);
}

export default Player;
