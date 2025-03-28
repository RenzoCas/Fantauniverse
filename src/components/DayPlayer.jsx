import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function DayPlayer({ playerObj, rules, dayPoints }) {
	const { name, icon } = playerObj;
	const [expanded, setExpanded] = useState(false);

	const randomLightColor = () => {
		const getRandomValue = () => Math.floor(Math.random() * 128) + 128;
		const r = getRandomValue();
		const g = getRandomValue();
		const b = getRandomValue();
		return `#${r.toString(16).padStart(2, "0")}${g
			.toString(16)
			.padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};

	return (
		<li
			className="flex flex-col gap-[8px] py-[8px] border-b border-b-(--black-light)"
			onClick={() => setExpanded(!expanded)}
		>
			<div className="flex items-center gap-[20px]">
				<picture className="rounded-[3px] h-[40px] min-w-[40px] max-w-[40px] flex-shrink-1">
					{icon == null ? (
						<div
							className={`rounded-[3px] h-[40px] w-[40px] object-cover`}
							style={{ backgroundColor: randomLightColor() }}
						></div>
					) : (
						<img
							src={`data:image/png;base64,${icon}`}
							alt={`immagine giocatore`}
							className="rounded-[3px] h-[40px] w-[40px] object-cover"
						/>
					)}
				</picture>
				<h5 className="body-normal font-semibold flex-1">{name}</h5>
				<div className="flex items-center gap-[10px]">
					<p className="body-normal font-semibold">
						{dayPoints} ptn.
					</p>
					{expanded ? (
						<ChevronUpIcon className="h-[16px] w-[16px] stroke-2" />
					) : (
						<ChevronDownIcon className="h-[16px] w-[16px] stroke-2" />
					)}
				</div>
			</div>
			{expanded && (
				<ul className="flex flex-col gap-[8px]">
					{rules
						?.filter((r) => !r.malus)
						?.map((el) => (
							<li key={el.id} className="flex flex-col gap-[4px]">
								<div className="flex justify-between gap-[8px]">
									<h6 className="body-normal font-semibold">
										{el.name}
									</h6>
									<p className="body-normal font-semibold">
										{el.value}
									</p>
								</div>
								<p className="body-normal font-light line-clamp-2">
									{el.rule}
								</p>
							</li>
						))}
					{rules
						?.filter((r) => r.malus)
						?.map((el) => (
							<li key={el.id} className="flex flex-col gap-[4px]">
								<div className="flex justify-between gap-[8px]">
									<h6 className="body-normal font-semibold text-(--error-normal)">
										{el.name}
									</h6>
									<p className="body-normal font-semibold text-(--error-normal)">
										-{el.value}
									</p>
								</div>
								<p className="body-normal font-light line-clamp-2">
									{el.rule}
								</p>
							</li>
						))}
				</ul>
			)}
		</li>
	);
}

export default DayPlayer;
