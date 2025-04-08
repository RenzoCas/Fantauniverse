import { useEffect, useState } from "react"; // Aggiungi useEffect
import NormalButton from "../../atoms/Buttons/NormalButton";
import { useModal } from "../../contexts/ModalContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../../contexts/LeagueContext";
import GenericInput from "../../atoms/Inputs/GenericInput";

function ModalAddPoints({
	isOpen,
	onClose,
	ruleObj,
	playersSelected,
	onConfirm,
}) {
	const { openBackdrop, closeBackdrop } = useModal();
	const { league } = useLeague();
	const { players } = league;
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPlayers, setFilteredPlayers] = useState([]);
	const [randomColors, setRandomColors] = useState([]);
	const [selectedPlayers, setSelectedPlayers] = useState([]);

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
		if (players && players.length > 0) {
			const colors = players.map(() => randomLightColor());
			setRandomColors(colors);
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			openBackdrop();
		} else {
			closeBackdrop();
		}
	}, [isOpen]);

	useEffect(() => {
		if (playersSelected && ruleObj) {
			const filtered = playersSelected
				.filter((entry) =>
					entry.rules.some((rule) => rule.id === ruleObj.id)
				)
				.map((entry) => entry.player);

			setSelectedPlayers(filtered);
		}
	}, [playersSelected, ruleObj]);

	useEffect(() => {
		if (players) {
			setFilteredPlayers(players);
		}
	}, [players]);

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

	const filterPlayers = (e) => {
		const value = e.target.value.toLowerCase();
		setSearchTerm(value);
		const filtered = players.filter((p) =>
			p.name.toLowerCase().includes(value)
		);
		setFilteredPlayers(filtered);
	};

	const togglePlayerSelection = (player) => {
		setSelectedPlayers((prevSelected) => {
			const isAlreadySelected = prevSelected.some(
				(p) => p.id === player.id
			);
			if (isAlreadySelected) {
				return prevSelected.filter((p) => p.id !== player.id);
			} else {
				return [...prevSelected, player];
			}
		});
	};

	return (
		<>
			<div
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

					<button onClick={onClose} className="cursor-pointer">
						<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
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

						return (
							<li
								key={idx}
								className="flex items-center gap-[20px]"
							>
								<button
									className={`h-[20px] w-[20px] border-[1.5px] border-solid rounded-[4px] ${
										isSelected
											? "bg-(--black-light-active)"
											: "bg-white"
									}`}
									onClick={() =>
										togglePlayerSelection(player)
									}
								></button>
								<picture className="rounded-lg min-w-[32px] max-w-[32px] h-[32px] overflow-hidden">
									{player.icon == null ? (
										<div
											className="h-full object-cover"
											style={{
												backgroundColor:
													randomColors[idx],
											}}
										></div>
									) : (
										<img
											src={`data:image/png;base64,${player.icon}`}
											alt={`Icona utente`}
											className="h-full object-cover"
											loading="lazy"
										/>
									)}
								</picture>
								{player.name}
							</li>
						);
					})}
				</ul>

				<NormalButton
					action={() => {
						onClose();
						onConfirm(ruleObj, selectedPlayers);
					}}
					icon={false}
					text="Conferma"
					classOpt="sticky bottom-0"
				/>
			</div>
		</>
	);
}

export default ModalAddPoints;
