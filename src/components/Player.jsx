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
	dayPoints,
	playerActive,
	addPoints,
	dataDay,
	handleAddPoints,
	viewTeam = false,
	handleTabChange,
}) {
	const { name, price, points, iconUrl, isCaptain } = playerObj;
	const { league } = useLeague();
	const { coinName, status, enableCaptain } = league;
	const { user } = useUser();
	const isActive =
		playerActive || playersObj?.find((el) => el.id == playerObj.id);
	const isCurrentUser = playerObj.id == user.id;
	const [randomColor, setRandomColor] = useState("#ffffff");
	const totalPoints =
		dataDay?.players?.find((p) => p.player.id === playerObj.id)?.points ||
		0;

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
				<button
					className={`flex flex-col gap-[8px] border-b border-(--black-light) pb-[8px] transform transition-all duration-300 cursor-pointer`}
					onClick={() => handleClickPlayer()}
				>
					<div className="flex gap-[20px]">
						<picture
							className={`rounded-[3px] h-[38px] min-w-[38px] max-w-[38px] flex-shrink-1 overflow-hidden relative ${
								!createTeam
									? "opacity-100"
									: canAdd || isActive
									? "opacity-100"
									: "opacity-50"
							}`}
						>
							{iconUrl == null ? (
								<div
									className={`rounded-[3px] h-full w-full object-cover`}
									style={{ backgroundColor: randomColor }}
								></div>
							) : (
								<img
									src={`${iconUrl}`}
									alt={`immagine player`}
									className="rounded-[3px] h-full w-full object-cover"
									loading="lazy"
								/>
							)}
						</picture>
						<p
							className={`body-normal font-semibold text-(--black-darker) break-all self-center`}
						>
							{name}
						</p>
						<div className="flex items-center gap-[20px] ml-auto">
							{isCaptain && (
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<rect
										x="0.83"
										y="0.89"
										width="18.33"
										height="18.23"
										fill="white"
									/>
									<rect
										x="0.83"
										y="0.89"
										width="18.33"
										height="18.23"
										stroke="#202020"
									/>
									<path
										d="M10 15.63C9.298 15.63 8.76017 15.42 8.3865 15C8.02083 14.58 7.838 13.93 7.838 13.05V6.95C7.838 6.07 8.02083 5.42 8.3865 5C8.76017 4.58 9.298 4.37 10 4.37C10.702 4.37 11.2352 4.58 11.6012 5C11.9752 5.42 12.1622 6.07 12.1622 6.95V7.78H10.7733V6.8C10.7733 6.36267 10.529 6.14 10.0405 6.14C9.55183 6.14 9.3075 6.36267 9.3075 6.8V13.2C9.3075 13.636 9.55183 13.86 10.0405 13.86C10.529 13.86 10.7733 13.636 10.7733 13.2V11.92H12.1622V13.05C12.1622 13.93 11.9752 14.58 11.6012 15C11.2352 15.42 10.702 15.63 10 15.63Z"
										fill="black"
									/>
								</svg>
							)}
							<p className="body-normal font-semibold text-(--black-darker) whitespace-nowrap">
								{points} pnt.
							</p>
							{dayPoints?.length > 0 && (
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
					{isExpanded && dayPoints.length > 0 && (
						<ul className="flex flex-col gap-[8px]">
							{dayPoints.map((pd, idx) => (
								<li
									key={idx}
									className="flex items-center justify-between w-full"
								>
									<p className="body-normal font-semibold flex flex-1">
										{pd.day?.name}
									</p>
									<p
										className={`body-normal font-semibold whitespace-nowrap ${
											pd.points < 0
												? "text-(--error-normal)"
												: ""
										}`}
									>
										{pd.points} pnt.{" "}
										{isCaptain && (
											<span className="text-(--black-light-active)">
												x2
											</span>
										)}
									</p>
								</li>
							))}
						</ul>
					)}
				</button>
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
						{iconUrl == null ? (
							<div
								className={`rounded-[3px] h-[38px] w-[38px] object-cover`}
								style={{ backgroundColor: randomColor }}
							></div>
						) : (
							<img
								src={`${iconUrl}`}
								alt={`immagine player`}
								className="rounded-[3px] h-[38px] w-[38px] object-cover"
								loading="lazy"
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

					{canEdit &&
						(status === "PENDING" || status === "NOT_STARTED") && (
							<button
								className="flex cursor-pointer"
								onClick={() => onEdit(playerObj)}
							>
								<PencilSquareIcon className="h-[20px] w-[20px]" />
							</button>
						)}
					{addPoints && (
						<button
							className="flex cursor-pointer"
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
											className="cursor-pointer"
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
										className="cursor-pointer"
									>
										<SquareMinus className="h-[24px] w-[24px] stroke-(--error-normal) flex-shrink-0" />
									</button>
								</div>
							) : (
								<button
									className={`flex self-center cursor-pointer ${
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
