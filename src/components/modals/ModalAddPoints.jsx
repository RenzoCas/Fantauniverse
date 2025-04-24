import { useEffect, useRef, useState } from "react"; // Aggiungi useEffect
import NormalButton from "../../atoms/Buttons/NormalButton";
import { useModal } from "../../contexts/ModalContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../../contexts/LeagueContext";
import GenericInput from "../../atoms/Inputs/GenericInput";
import FocusModal from "../../hooks/FocusModal";
import { SquareMinus, SquarePlus } from "lucide-react";

function ModalAddPoints({
	isOpen,
	onClose,
	ruleObj,
	playersSelected,
	onConfirm,
	tempDayRef,
}) {
	const { openBackdrop, closeBackdrop } = useModal();
	const { league } = useLeague();
	const { players } = league;
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPlayers, setFilteredPlayers] = useState([]);
	const [randomColors, setRandomColors] = useState([]);
	const [selectedPlayers, setSelectedPlayers] = useState([]);
	const [counterPlayers, setCounterPlayers] = useState([]);
	const playerRules =
		tempDayRef.current?.rules?.filter((el) => el.rule.id === ruleObj?.id) ||
		[];

	const playerIds = playerRules.flatMap((r) => r.players.map((p) => p.id));

	const modalRef = useRef(null);
	FocusModal(modalRef, isOpen);

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
		if (tempDayRef.current && ruleObj) {
			const newCounterPlayers = tempDayRef.current.rules
				.filter((rule) => rule.rule.id === ruleObj?.id) // Filtra le regole per la regola specifica
				.flatMap((rule) =>
					rule.players.map((player) => {
						const playerCounter = rule.counter || 1; // Usa il counter della regola, fallback a 1 se non presente
						return {
							id: player.id, // L'ID del giocatore
							counter: playerCounter,
						};
					})
				);

			setCounterPlayers(newCounterPlayers);
		}
	}, [tempDayRef, ruleObj]); // Esegui l'effetto quando cambia tempDayRef o ruleObj

	useEffect(() => {
		console.log(playerRules);
		console.log(playerIds);
		if (players && players.length > 0) {
			setRandomColors(players.map(() => randomLightColor()));
		}
	}, []);

	useEffect(() => {
		if (isOpen) openBackdrop();
		else closeBackdrop();
	}, [isOpen]);

	useEffect(() => {
		if (playersSelected && ruleObj) {
			const filtered = playersSelected
				.filter((entry) =>
					entry.rules.some((rule) => rule.id === ruleObj.id)
				)
				.map((entry) => {
					const rule = entry.rules.find((r) => r.id === ruleObj.id);
					return {
						player: entry.player,
						counter: rule?.counter || 1,
					};
				});

			setSelectedPlayers(filtered.map((item) => item.player));
		}
	}, [playersSelected, ruleObj]);

	useEffect(() => {
		if (players) {
			setFilteredPlayers(players);
		}
	}, [players]);

	useEffect(() => {
		const handleEsc = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	const filterPlayers = (e) => {
		const value = e.target.value.toLowerCase();
		setSearchTerm(value);
		setFilteredPlayers(
			players.filter((p) => p.name.toLowerCase().includes(value))
		);
	};

	const togglePlayerSelection = (player) => {
		setSelectedPlayers((prevSelected) => {
			const alreadySelected = prevSelected.some(
				(p) => p.id === player.id
			);

			if (alreadySelected) {
				// Rimuovi il giocatore e il relativo counter
				setCounterPlayers((prev) =>
					prev.filter((cp) => cp.id !== player.id)
				);
				return prevSelected.filter((p) => p.id !== player.id);
			} else {
				// Aggiungi il giocatore e imposta il counter iniziale
				const initialCounter =
					counterPlayers.find((cp) => cp.id === player.id)?.counter ||
					1;
				setCounterPlayers((prev) => [
					...prev,
					{ id: player.id, counter: initialCounter },
				]);
				return [...prevSelected, player];
			}
		});
	};

	const updateCounterForPlayer = (id, value) => {
		setCounterPlayers((prev) =>
			prev.map((cp) =>
				cp.id === id ? { ...cp, counter: Math.max(value, 1) } : cp
			)
		);
	};

	return (
		<div
			ref={modalRef}
			role="dialog"
			aria-modal="true"
			tabIndex="-1"
			className={`fixed bottom-0 left-0 bg-white shadow-lg rounded-t-[12px] px-[16px] pb-[16px] lg:px-[24px] lg:pb-[24px] w-full transition-all duration-300 ease flex flex-col z-1001 max-h-[calc(100dvh-80px)] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:rounded-[12px] lg:max-w-[600px] lg:max-h-[600px] overflow-y-auto ${
				isOpen
					? "scale-100 opacity-100 translate-y-0 lg:bottom-1/2 lg:translate-y-1/2 visible"
					: "scale-80 opacity-30 translate-y-full lg:translate-y-0 invisible"
			}`}
		>
			<div className="flex items-start justify-between gap-[8px] sticky top-0 py-[16px] lg:py-[24px] bg-white z-2">
				<div className="flex flex-col gap-[8px]">
					<h4 className="body-normal font-semibold text-(--black-normal)">
						{ruleObj?.name}
					</h4>
					<p className="body-small font-medium text-(--black-normal)">
						{ruleObj?.rule}
					</p>
				</div>
				<button onClick={onClose}>
					<XMarkIcon className="h-[24px] w-[24px]" />
				</button>
			</div>

			<div className="flex flex-col gap-[8px]">
				<label
					htmlFor="filterPlayer"
					className="body-normal text-(--black-light-active) font-medium"
				>
					Cerca player:
				</label>
				<GenericInput
					type="text"
					name="filterPlayer"
					id="filterPlayer"
					handleChange={filterPlayers}
					value={searchTerm}
					placeholder="Cerca player"
				/>
			</div>

			<ul className="flex flex-col gap-[8px] py-[16px] lg:py-[24px]">
				{filteredPlayers.map((player, idx) => {
					const isSelected = selectedPlayers.some(
						(p) => p.id === player.id
					);

					// Ottieni il valore di counter per il giocatore corrente
					const playerCounter =
						counterPlayers.find((cp) => cp.id === player.id)
							?.counter || 1;

					return (
						<li
							key={idx}
							className="flex items-center gap-[12px] cursor-pointer"
						>
							<button
								className={`h-[20px] w-[20px] border-[1.5px] border-solid rounded-[4px] ${
									isSelected
										? "bg-(--black-light-active)"
										: "bg-white"
								}`}
								onClick={() => togglePlayerSelection(player)}
							></button>
							{ruleObj?.cumulative && isSelected && (
								<div
									className="flex items-center gap-[4px]"
									onClick={(e) => e.stopPropagation()}
								>
									<button
										onClick={() => {
											const newValue = Math.max(
												playerCounter - 1,
												1
											);
											updateCounterForPlayer(
												player.id,
												newValue
											);
										}}
									>
										<SquareMinus className="stroke-(--error-normal) h-[24px] w-[24px]" />
									</button>
									<span className="body-normal font-semibold">
										{playerCounter}
									</span>
									<button
										onClick={() => {
											updateCounterForPlayer(
												player.id,
												playerCounter + 1
											);
										}}
									>
										<SquarePlus className="h-[24px] w-[24px]" />
									</button>
								</div>
							)}

							<picture className="rounded-lg min-w-[32px] max-w-[32px] h-[32px] flex-shrink-1 overflow-hidden">
								{player.icon == null ? (
									<div
										className="h-full w-full object-cover"
										style={{
											backgroundColor: randomColors[idx],
										}}
									></div>
								) : (
									<img
										src={`data:image/png;base64,${player.icon}`}
										alt="Icona utente"
										className="h-full w-full object-cover"
										loading="lazy"
									/>
								)}
							</picture>
							<span className="flex-1">{player.name}</span>
						</li>
					);
				})}
			</ul>

			<NormalButton
				action={() => {
					onClose();
					onConfirm(ruleObj, selectedPlayers, false, counterPlayers);
				}}
				icon={false}
				text="Conferma"
				classOpt="sticky bottom-0"
				type="submit"
			/>
		</div>
	);
}

export default ModalAddPoints;
