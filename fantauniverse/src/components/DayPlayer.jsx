import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function DayPlayer({ playerObj }) {
	const { name, icon, totalPoints, bonus, malus } = playerObj;
	const [expanded, setExpanded] = useState(false);

	return (
		<li className="flex flex-col gap-[8px] py-[8px] border-b border-b-(--black-light)">
			<div className="flex items-center gap-[20px]">
				<picture className="rounded-[3px] h-[48px] min-w-[48px] max-w-[48px] flex-shrink-1">
					<img
						src={
							icon != null
								? `data:image/png;base64,${icon}`
								: "https://placehold.co/48x48"
						}
						alt="immagine giocatore"
						className="rounded-[3px] h-[48px] w-[48px] object-cover"
						style={{ cursor: "pointer" }}
					/>
				</picture>
				<h5 className="body-normal font-semibold flex-1">{name}</h5>
				<div className="flex gap-[10px]">
					<p className="body-normal font-semibold">
						{totalPoints} ptn.
					</p>
					<button
						className="flex"
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? (
							<ChevronUpIcon className="h-[16px] w-[16px] stroke-2" />
						) : (
							<ChevronDownIcon className="h-[16px] w-[16px] stroke-2" />
						)}
					</button>
				</div>
			</div>
			{expanded && (
				<ul className="flex flex-col gap-[8px]">
					{bonus?.map((el) => (
						<li key={el.id} className="flex flex-col gap-[4px]">
							<div className="flex justify-between gap-[8px]">
								<h6 className="body-normal font-semibold">
									{el.title}
								</h6>
								<p className="body-normal font-semibold">
									{el.points}
								</p>
							</div>
							<p className="body-normal font-light line-clamp-2">
								{el.text}
							</p>
						</li>
					))}
					{malus?.map((el) => (
						<li key={el.id} className="flex flex-col gap-[4px]">
							<div className="flex justify-between gap-[8px]">
								<h6 className="body-normal font-semibold text-(--error-normal)">
									{el.title}
								</h6>
								<p className="body-normal font-semibold text-(--error-normal)">
									-{el.points}
								</p>
							</div>
							<p className="body-normal font-light line-clamp-2">
								{el.text}
							</p>
						</li>
					))}
				</ul>
			)}
		</li>
	);
}

export default DayPlayer;
