import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";
import { useLeague } from "../contexts/LeagueContext";

function CardSquadra({ team, handleClick }) {
	const { league } = useLeague();
	const { status } = league;

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
		<>
			<div
				role="button"
				tabIndex="0"
				className="flex items-center gap-[10px] bg-(--black-normal) rounded-[16px] p-[8px] sticky bottom-[24px] w-[calc(100vw-32px)] md:max-w-[528px]"
				onClick={handleClick}
			>
				<img
					src={
						icon
							? `data:image/png;base64,${icon}`
							: "https://placehold.co/60x60"
					}
					alt={`Icona utente`}
					className="h-full object-cover rounded-[8px]"
				/>
				<div className="flex flex-col grow-1 justify-between gap-[6px]">
					<div className="flex justify-between gap-[8px]">
						<p className="body-small text-white">La tua squadra:</p>
						{status == "NOT_STARTED" && (
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
		</>
	);
}

export default CardSquadra;
