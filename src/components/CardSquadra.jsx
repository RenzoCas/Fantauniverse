import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";
import { useLeague } from "../contexts/LeagueContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function CardSquadra({ team, handleClick }) {
	const { league } = useLeague();
	const { status } = league;

	const [isExpanded, setIsExpanded] = useState(false);
	const [randomColor, setRandomColor] = useState("#ffffff");

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

	if (!team) {
		return (
			<NormalButton
				text="Crea squadra"
				action={handleClick}
				classOpt="sticky bottom-[32px]"
			/>
		);
	}

	const { name, icon, position } = team;

	return (
		<motion.div
			role="button"
			tabIndex="0"
			className={`fixed bottom-[32px] left-[16px] right-0 flex flex-col gap-[16px] bg-black rounded-[16px] py-[16px] px-[8px] max-w-[calc(100vw-32px)] md:max-w-[528px] md:left-1/2 md:-translate-x-1/2 transition-all duration-500 `}
			onClick={handleClick}
			initial={{ y: "99%" }}
			animate={{ y: isExpanded ? "0%" : "99%" }}
			transition={{ duration: 0.5, ease: "easeInOut" }}
			drag="y"
			dragConstraints={{ top: 0, bottom: 10 }}
			onDragEnd={(event, info) => {
				if (info.offset.y > 5) {
					setIsExpanded(false);
				} else if (info.offset.y < -5) {
					setIsExpanded(true);
				}
			}}
		>
			<span className="h-[4px] w-[60px] rounded-full bg-white flex self-center"></span>

			<div className="flex items-center gap-[10px]">
				<picture className="rounded-lg min-w-[60px] max-w-[60px] h-[60px] overflow-hidden">
					{icon == null ? (
						<div
							className={`h-full object-cover`}
							style={{
								backgroundColor: randomColor,
							}}
						></div>
					) : (
						<img
							src={`data:image/png;base64,${icon}`}
							alt={`Icona utente`}
							className="h-full object-cover"
						/>
					)}
				</picture>
				<div className="flex flex-col grow-1 justify-between gap-[6px]">
					<div className="flex justify-between gap-[8px]">
						<p className="body-small text-white">La tua squadra:</p>
						{status === "NOT_STARTED" && (
							<WrenchScrewdriverIcon className="h-[20px] w-[20px] stroke-white" />
						)}
					</div>

					<h4 className="body-regular text-white">{name}</h4>
					<p className="body-xsmall text-white">
						{position}
						<sup>°</sup> posto in classifica
					</p>
				</div>
			</div>
		</motion.div>
	);
}

export default CardSquadra;
