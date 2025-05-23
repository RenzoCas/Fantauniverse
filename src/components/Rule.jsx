import {
	ChevronDownIcon,
	ChevronUpIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { SquarePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Rule({
	ruleObj,
	canEdit,
	onEdit,
	isAddPoints,
	playersRule,
	onRemovePlayer,
	openModalAddPoints,
}) {
	const { name, rule, value } = ruleObj;
	const [expanded, setExpanded] = useState(false);
	const [randomColors, setRandomColors] = useState([]);
	const [players, setPlayers] = useState([]);
	const [showChevron, setShowChevron] = useState(false);

	const ruleRef = useRef(null);

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
		setExpanded(false);
	}, [ruleObj]);

	useEffect(() => {
		const players = playersRule?.filter((player) =>
			player.rules.some((rule) => rule.id === ruleObj.id)
		);
		setPlayers(players);
		if (playersRule && playersRule.length > 0) {
			const colors = players.map(() => randomLightColor());
			setRandomColors(colors);
		}
	}, [playersRule, ruleObj]);

	useEffect(() => {
		const pElement = ruleRef.current;
		if (pElement) {
			const lineHeight = parseFloat(
				getComputedStyle(pElement).lineHeight
			);
			const maxLines = 2;
			const shouldShowChevron =
				pElement.scrollHeight > lineHeight * maxLines;
			setShowChevron(shouldShowChevron);
		}
	}, [rule]);

	return (
		<li
			className={`flex flex-col border-b border-(--black-light) pb-[8px] gap-[8px] transform transition-all duration-300 has-disabled:opacity-[0.5]`}
		>
			<div
				className={`flex items-start ${
					isAddPoints ? "gap-[10px]" : "gap-[20px]"
				} ${isAddPoints ? "cursor-pointer" : ""}`}
				onClick={isAddPoints ? () => setExpanded(!expanded) : undefined}
			>
				{canEdit && (
					<button
						className="flex cursor-pointer"
						onClick={() => onEdit(ruleObj)}
					>
						<PencilSquareIcon className="h-[20px] w-[20px]" />
					</button>
				)}
				<div className="flex flex-col gap-[4px]">
					<p className="body-small font-semibold">{name}</p>
					{!isAddPoints && (
						<div className="flex items-end gap-[8px]">
							<p
								ref={ruleRef}
								className={`body-small text-(--black-normal)/70 transition-all ${
									expanded
										? "line-clamp-none"
										: "line-clamp-2"
								}`}
							>
								{rule}
							</p>
							{showChevron && (
								<button
									className="flex cursor-pointer"
									onClick={() => setExpanded(!expanded)}
								>
									{expanded ? (
										<ChevronUpIcon className="h-[16px] w-[16px] stroke-2 flex-shrink-0" />
									) : (
										<ChevronDownIcon className="h-[16px] w-[16px] stroke-2 flex-shrink-0" />
									)}
								</button>
							)}
						</div>
					)}
				</div>
				<p className="body-small font-semibold whitespace-nowrap ml-auto">
					{value} pnt.
				</p>
				{isAddPoints && (
					<button
						className="flex cursor-pointer"
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? (
							<ChevronUpIcon className="h-[20px] w-[20px]" />
						) : (
							<ChevronDownIcon className="h-[20px] w-[20px]" />
						)}
					</button>
				)}
			</div>
			{isAddPoints && expanded && (
				<>
					{players.length > 0 && (
						<ul className="flex flex-col gap-[8px]">
							{players.map((player, idx) => (
								<li
									key={idx}
									className="flex gap-[20px] items-center w-full"
								>
									<picture className="rounded-[3px] min-w-[32px] max-w-[32px] h-[32px] flex-shrink-1 overflow-hidden">
										{player.player.iconUrl == null ? (
											<div
												className={`h-full w-full object-cover`}
												style={{
													backgroundColor:
														randomColors[idx],
												}}
											></div>
										) : (
											<img
												src={`${player.player.iconUrl}`}
												alt={`Icona utente`}
												className="h-full w-full object-cover"
												loading="lazy"
											/>
										)}
									</picture>
									<div className="flex gap-[8px] items-center flex-1">
										<p className="body-normal font-semibold">
											{player.player.name}
										</p>
										<p className="body-small text-(--black-light-active)">
											{(() => {
												const rule = player.rules.find(
													(r) => r.id === ruleObj.id
												);
												return rule && rule.counter > 1
													? `x${rule.counter}`
													: null;
											})()}
										</p>
									</div>

									<button
										onClick={() =>
											onRemovePlayer(player, ruleObj)
										}
									>
										<TrashIcon className="h-[20px] w-[20px] stroke-(--error-normal) ml-auto" />
									</button>
								</li>
							))}
						</ul>
					)}

					<button
						className="flex items-center gap-[10px] mt-[12px] self-center body-normal font-semibold"
						onClick={() =>
							openModalAddPoints({ value: true, rule: ruleObj })
						}
					>
						<SquarePlus className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
						Assegna ai players
					</button>
				</>
			)}
		</li>
	);
}

export default Rule;
