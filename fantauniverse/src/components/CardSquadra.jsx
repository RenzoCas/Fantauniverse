import { BoltIcon } from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";

function CardSquadra({ team, handleClick }) {
	const { name, icon, position } = team;

	return (
		<>
			{!name ? (
				<NormalButton
					text="Crea squadra"
					action={handleClick}
					classOpt="sticky bottom-[32px]"
				/>
			) : (
				<div
					role="button"
					tabIndex="0"
					className="flex gap-[10px] bg-(--black-normal) rounded-[16px] p-[8px] sticky bottom-[24px] w-[calc(100vw-32px)] md:max-w-[528px]"
					onClick={handleClick}
				>
					<img
						src={`${icon} || https://placehold.co/83x83`}
						alt="logo squadra"
						className="rounded-[8px]"
					/>
					<div className="flex flex-col grow-1 justify-between gap-[6px]">
						<p className="body-normal text-white">
							La tua squadra:
						</p>
						<h4 className="title-h4 text-white">{name}</h4>
						<p className="body-small text-white">
							{position + 1}
							<sup>°</sup> posto in classifica
						</p>
					</div>
					<BoltIcon className="h-[24px] w-[24px] p-[4px] rounded-full text-(--black-normal) bg-(--black-light) group-hover:bg-(--black-normal) group-hover:text-white" />
				</div>
			)}
		</>
	);
}

export default CardSquadra;
