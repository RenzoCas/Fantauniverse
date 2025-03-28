import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";
import { useLeague } from "../contexts/LeagueContext";
import { motion } from "framer-motion";
import { useState } from "react";

function CardSquadra({ team, handleClick }) {
	const { league } = useLeague();
	const { status } = league;

	const [isExpanded, setIsExpanded] = useState(false);

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
			initial={{ y: "99%" }} // Inizialmente visibile solo il 20%
			animate={{ y: isExpanded ? "0%" : "99%" }} // Espande completamente o mostra solo il 20%
			transition={{ duration: 0.5, ease: "easeInOut" }}
			drag="y"
			dragConstraints={{ top: 0, bottom: 10 }}
			onDragEnd={(event, info) => {
				if (info.offset.y > 5) {
					setIsExpanded(false); // Slide down -> Chiude la card
				} else if (info.offset.y < -5) {
					setIsExpanded(true); // Slide up -> Apre la card
				}
			}}
		>
			{/* Indicatore di swipe */}
			<span className="h-[4px] w-[60px] rounded-full bg-white flex self-center"></span>

			{/* Contenuto principale della card */}
			<div className="flex items-center gap-[10px]">
				<picture className="rounded-lg min-w-[60px] max-w-[60px] h-[60px] overflow-hidden">
					<img
						src={
							icon
								? `data:image/png;base64,${icon}`
								: "https://placehold.co/60x60"
						}
						alt={`Icona utente`}
						className="h-full object-cover"
					/>
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
