import { useState, useEffect } from "react";
import { Cog6ToothIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function League({ league, onAddParticipant }) {
	const navigate = useNavigate();
	const { id, name, icon, isAdmin, isRegistered, position } = league;
	const numParticipants = league.participants
		? league.participants?.length
		: league.numberParticipants;

	const [randomColor, setRandomColor] = useState("#ffffff");
	const [randomColorPrimo, setRandomColorPrimo] = useState("#ffffff");
	const [randomColorSecondo, setRandomColorSecondo] = useState("#ffffff");
	const [randomColorTerzo, setRandomColorTerzo] = useState("#ffffff");

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
		setRandomColorPrimo(randomLightColor());
		setRandomColorSecondo(randomLightColor());
		setRandomColorTerzo(randomLightColor());
	}, []);

	const handleClick = () => {
		navigate(`league/${id}`, {
			state: { league, deleteLeague: null },
			replace: true,
		});
	};

	return (
		<li
			className="relative flex gap-[8px] p-[12px] border border-gray-300 rounded-lg bg-white cursor-pointer"
			onClick={isRegistered ? handleClick : undefined}
		>
			<picture className="relative z-2 rounded-lg min-w-[80px] max-w-[80px] h-[80px] overflow-hidden">
				{isAdmin && (
					<span className="absolute top-[8px] left-[8px] p-[2px] bg-white rounded-[4px]">
						<Cog6ToothIcon className="w-[20px] h-[20px]" />
					</span>
				)}
				{icon == null ? (
					<div
						className={`h-full object-cover`}
						style={{ backgroundColor: randomColor }}
					></div>
				) : (
					<img
						src={`data:image/png;base64,${icon}`}
						alt={`Logo lega ${name}`}
						className="h-full object-cover"
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
							<TrophyIcon className="w-[16px] h-[16x] stroke-[#B01DFF] stroke-2" />
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
							<li
								className="w-[37px] h-[37px] rounded-[2px] border border-solid border-white rotate-15"
								style={{ backgroundColor: randomColorPrimo }}
							></li>
							<li
								className="w-[37px] h-[37px] rounded-[2px] border border-solid border-white -rotate-10"
								style={{ backgroundColor: randomColorSecondo }}
							></li>
							<li
								className="w-[37px] h-[37px] rounded-[2px] border border-solid border-white rotate-10 flex items-center justify-center"
								style={{ backgroundColor: randomColorTerzo }}
							>
								<p className="body-normal font-semibold">
									+{numParticipants - 1}
								</p>
							</li>
						</ul>
					</div>
				) : (
					<div className="flex items-center justify-end gap-[8px]">
						<button
							className="border-2 border-solid border-(--black-normal) rounded-[4px] px-[18px] py-[4px] body-small font-semibold bg-white"
							onClick={handleClick}
						>
							Scopri
						</button>
						<button
							className="border-2 border-solid border-(--accent-normal) rounded-[4px] px-[18px] py-[4px] body-small text-white font-semibold bg-(--accent-normal)"
							onClick={() => onAddParticipant(id)}
						>
							Iscriviti
						</button>
					</div>
				)}
			</div>
			<div className="absolute bottom-0 left-0 h-[30px] w-full bg-(--black-light)/60"></div>
		</li>
	);
}
