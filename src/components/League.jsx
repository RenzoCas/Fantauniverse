import { useState, useEffect } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Award } from "lucide-react";
// import { useUser } from "../contexts/UserContext";

export default function League({ league, onAddParticipant, classOpt }) {
	const navigate = useNavigate();
	const {
		id,
		name,
		icon,
		isAdmin,
		isRegistered,
		position,
		status,
		participants,
		numberParticipants,
	} = league;
	const numParticipants = participants
		? participants?.length
		: numberParticipants;

	const [randomColors, setRandomColors] = useState([]);

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
		const numColors = Math.min(numParticipants + 1, 4);

		const colors = Array.from({ length: numColors }, () =>
			randomLightColor()
		);
		setRandomColors(colors);
	}, [numParticipants]);

	const handleClick = () => {
		navigate(`league/${id}`, {
			state: { league, deleteLeague: null },
			replace: true,
		});
	};

	return (
		<li
			className={`relative flex gap-[8px] p-[12px] border border-gray-300 rounded-lg bg-white cursor-pointer lg:max-w-[400px] ${classOpt}`}
			onClick={isRegistered ? handleClick : undefined}
			tabIndex={isRegistered ? 0 : undefined}
		>
			<picture className="relative z-2 rounded-lg min-w-[80px] max-w-[80px] h-[80px] overflow-hidden relative">
				{isAdmin && (
					<span className="absolute top-[8px] left-[8px] p-[2px] bg-white rounded-[4px]">
						<Cog6ToothIcon className="w-[20px] h-[20px]" />
					</span>
				)}
				{icon == null ? (
					<div
						className={`h-full object-cover`}
						style={{ backgroundColor: randomColors[0] }}
					></div>
				) : (
					<img
						src={`data:image/png;base64,${icon}`}
						alt={`Logo lega ${name}`}
						className="h-full object-cover"
						loading="lazy"
					/>
				)}
			</picture>
			<div className="flex flex-col gap-[6px] w-full z-2 justify-between">
				<div className="flex flex-col">
					<h4 className="body-regular font-semibold text-(--black-normal)">
						{name}
					</h4>
					{isRegistered ? (
						<div className="flex gap-[4px]">
							<Award className="h-[24px] w-[24px] stroke-[#B01DFF] flex-shrink-0" />
							<span className="body-small font-semibold">
								{position}&#176; Posto
							</span>
						</div>
					) : (
						<p className="body-small font-semibold">
							{`${numParticipants} ${
								numParticipants == 1
									? "Partecipante"
									: "Partecipanti"
							}`}
						</p>
					)}
				</div>
				{isRegistered ? (
					<div className="flex items-end justify-between">
						<h6 className="body-small font-semibold">Gioca con:</h6>
						<ul className="flex items-center">
							{Array.from({
								length: Math.min(numParticipants, 2),
							}).map((_, index) => (
								<li
									key={index}
									className={`w-[37px] h-[37px] rounded-[2px] border border-solid border-white ${
										index === 0
											? "rotate-15"
											: index === 1
											? "-rotate-10"
											: index === 2
											? "rotate-20"
											: ""
									}`}
									style={{
										backgroundColor: randomColors[index],
									}}
								></li>
							))}

							{numParticipants == 3 && (
								<li
									className="w-[37px] h-[37px] rounded-[2px] border border-solid border-white rotate-20"
									style={{
										backgroundColor:
											randomColors[
												randomColors.length - 1
											],
									}}
								></li>
							)}

							{numParticipants > 3 && (
								<li
									className="w-[37px] h-[37px] rounded-[2px] border border-solid border-white rotate-15 flex items-center justify-center"
									style={{
										backgroundColor:
											randomColors[
												randomColors.length - 1
											],
									}}
								>
									<p className="body-normal font-semibold">
										+{numParticipants - 2}
									</p>
								</li>
							)}
						</ul>
					</div>
				) : (
					<div className="flex items-center justify-end gap-[8px]">
						<button
							className="border-2 border-solid border-(--black-normal) rounded-[4px] px-[18px] py-[4px] body-small font-semibold bg-white cursor-pointer focus:outline-(--black-normal) focus:outline-2"
							onClick={handleClick}
						>
							{isAdmin ? "Aggiorna" : "Scopri"}
						</button>
						{status == "NOT_STARTED" && (
							<button
								className="border-2 border-solid border-(--accent-normal) rounded-[4px] px-[18px] py-[4px] body-small text-white font-semibold bg-(--accent-normal) focus:outline-(--accent-normal) focus:outline-2 cursor-pointer"
								onClick={() => onAddParticipant(id)}
							>
								Iscriviti
							</button>
						)}
					</div>
				)}
			</div>
			<div className="absolute bottom-0 left-0 h-[30px] w-full bg-(--black-light)/60"></div>
		</li>
	);
}
