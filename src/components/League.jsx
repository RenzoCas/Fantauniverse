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
		iconUrl,
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
		navigate(`league/${id}`);
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
				{iconUrl == null ? (
					<div
						className={`h-full object-cover`}
						style={{ backgroundColor: randomColors[0] }}
					></div>
				) : (
					<img
						src={`${iconUrl}`}
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
						<div className="flex items-center">
							{participants
								?.slice(0, 2)
								.map((participant, index) => (
									<div
										key={index}
										className={`w-[37px] h-[37px] rounded-[2px] border border-solid border-white relative ${
											index === 0
												? "rotate-15"
												: index === 1
												? "-rotate-10"
												: ""
										} overflow-hidden flex-shrink-0`}
										style={{
											backgroundColor: participant.iconUrl
												? "transparent"
												: randomColors[index],
										}}
									>
										{participant.user.iconUrl ? (
											<img
												src={participant.user.iconUrl}
												alt={`Icona di ${participant.user.username}`}
												className="w-full h-full object-cover"
											/>
										) : (
											<p className="body-small absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
												{participant.user.username
													.slice(0, 2)
													.toUpperCase()}
											</p>
										)}
									</div>
								))}

							{participants?.length === 3 && (
								<div
									className="w-[37px] h-[37px] rounded-[2px] border border-solid border-white rotate-20 overflow-hidden flex-shrink-0 relative"
									style={{
										backgroundColor:
											participants[2]?.user.iconUrl ==
											null
												? randomColors[2]
												: "transparent",
									}}
								>
									{participants[2]?.user.iconUrl ? (
										<img
											src={participants[2].user.iconUrl}
											alt={`Icona di ${participants[2].user.username}`}
											className="w-full h-full object-cover"
										/>
									) : (
										<p className="body-small absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
											{participants[2]?.user.username
												.slice(0, 2)
												.toUpperCase()}
										</p>
									)}
								</div>
							)}

							{participants?.length > 3 && (
								<div className="w-[37px] h-[37px] rounded-[2px] border border-solid border-white rotate-15 flex items-center justify-center bg-gray-200">
									<p className="body-normal font-semibold">
										+{participants.length - 2}
									</p>
								</div>
							)}
						</div>
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
