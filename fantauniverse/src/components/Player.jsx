import {
	MinusCircleIcon,
	PencilSquareIcon,
	PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";

function Player({
	playerObj,
	canEdit,
	createTeam,
	onEdit,
	canAdd,
	onSelect,
	onDeselect,
	playersObj,
	playerActive,
	addPoints,
	dataDay,
	handleAddPoints,
}) {
	const { name, price, points, icon, id } = playerObj;
	const { league } = useLeague();
	const { coinName, status, rules } = league;
	const isActive =
		playerActive || playersObj?.find((el) => el.id == playerObj.id);

	const totalPoints = dataDay?.players
		.filter((p) => p.id === id) // Trova il player con id corretto
		.map((player) => {
			return player.rules.reduce((total, ruleId) => {
				// Trova la regola completa corrispondente all'ID
				const rule = rules.find((r) => r.id === ruleId);

				// Se la regola è trovata, calcola i punti
				if (rule) {
					if (rule.malus) {
						// Se la regola è un malus, sottrai il valore
						return total - rule.value;
					} else {
						// Se la regola è un bonus, somma il valore
						return total + rule.value;
					}
				}
				return total; // Se non trovi la regola, non fare nulla
			}, 0); // Inizializza il total a 0
		})[0]; // [0] per prendere il risultato del primo (e unico) giocatore trovato

	return (
		<li
			className={`flex border-b border-(--black-light) pb-[8px] gap-[16px] transform transition-all duration-300 has-disabled:opacity-[0.5] ${
				isActive && "shadow-lg border p-[8px] rounded-[8px]"
			}`}
		>
			<picture className="rounded-full h-[40px] min-w-[40px] max-w-[40px] flex-shrink-1">
				<img
					src={
						icon != null
							? `data:image/png;base64,${icon}`
							: "https://placehold.co/40x40"
					}
					alt="immagine giocatore"
					className="rounded-full h-[40px] w-[40px] object-cover"
					style={{ cursor: "pointer" }}
				/>
			</picture>
			<div className={`flex flex-col gap-[4px] w-full`}>
				<p className="body-normal font-semibold">{name}</p>
				{canEdit && status == "PENDING" ? (
					<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
						{price} {coinName}
					</p>
				) : status == "NOT_STARTED" ? (
					<>
						<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
							{price} {coinName}
						</p>
					</>
				) : (
					<>
						{addPoints ? (
							<>
								<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
									{points} ptn. totali
								</p>
								<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
									{totalPoints || 0} ptn. giornata
								</p>
							</>
						) : (
							<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
								{points} ptn.
							</p>
						)}
					</>
				)}
			</div>
			{canEdit && status == "PENDING" && (
				<button className="flex" onClick={() => onEdit(playerObj)}>
					<PencilSquareIcon className="h-[20px] w-[20px]" />
				</button>
			)}
			{addPoints && (
				<button
					className="flex"
					onClick={() => handleAddPoints(playerObj)}
				>
					<PencilSquareIcon className="h-[20px] w-[20px]" />
				</button>
			)}

			{createTeam && (
				<>
					{isActive ? (
						<button
							className="flex"
							onClick={() => onDeselect(playerObj)}
						>
							<MinusCircleIcon className="h-[20px] w-[20px]" />
						</button>
					) : (
						<button
							className={`flex ${
								!canAdd && "opacity-50 cursor-not-allowed"
							}`}
							onClick={() => canAdd && onSelect(playerObj)}
							disabled={!canAdd}
						>
							<PlusCircleIcon className="h-[20px] w-[20px]" />
						</button>
					)}
				</>
			)}
		</li>
	);
}

export default Player;
