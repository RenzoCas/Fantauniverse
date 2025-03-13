import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../../contexts/LeagueContext";
import Player from "../Player";
import { useState } from "react";
import GenericInput from "../../atoms/Inputs/GenericInput";
import NormalButton from "../../atoms/Buttons/NormalButton";

function ModalTeam({ isOpen, isEdit, onClose, teamObj }) {
	const { league } = useLeague();
	const { maxCoins, coinName } = league;
	const { players } = league;
	const [canAdd, setCanAdd] = useState(true);
	const [tempTeam, setTempTeam] = useState({
		name: teamObj?.name || "",
		players: teamObj?.players || [],
	});
	const [tempMaxCoins, setTempMaxCoins] = useState(maxCoins);
	const [errors, setErrors] = useState({});

	const handleChangeName = (e) => {
		const { value } = e.target;
		setTempTeam((prev) => ({
			...prev,
			name: value,
		}));
	};

	const handleBlurName = (e) => {
		const { name, value } = e.target;
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: value.trim() ? "" : "Campo obbligatorio",
		}));
	};

	const isFormValid = () => {
		return (
			tempTeam?.name?.trim() !== "" &&
			tempTeam?.players?.length > 0 &&
			tempMaxCoins >= 0
		);
	};

	const handleSelectPlayer = (player) => {
		const canAdd = updateCoin(player);
		if (canAdd) {
			setTempTeam((prevTeam) => ({
				...prevTeam,
				players: [...prevTeam.players, player],
			}));
			setTempMaxCoins((prevMax) => prevMax - player.price);
		} else {
			setCanAdd(false);
		}
	};

	const handleDeselectPlayer = (player) => {
		const canAdd = updateCoin(player);
		if (canAdd) {
			setTempTeam((prevTeam) => ({
				...prevTeam,
				players: prevTeam.players.filter((p) => p.id !== player.id),
			}));
			setTempMaxCoins((prevMax) => prevMax + player.price);
		}
	};

	const updateCoin = (player) => {
		tempTeam.players.map((p) => {
			if (p.price + player.price > tempMaxCoins) {
				return false;
			}
		});
		return true;
	};

	return (
		<div
			id="modalPlayer"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-t-lg p-4 w-full transition-transform duration-500 ease flex flex-col gap-[16px] z-100 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<div className="flex flex-col gap-[4px]">
					<button onClick={onClose} className="flex self-end">
						<XMarkIcon className="h-[24px] w-[24px]" />
					</button>
					<h4 className="font-semibold text-(--black-normal)">
						{isEdit ? "Modifica" : "Crea"} la tua squadra
					</h4>
					<h6 className="body-small font-semibold">
						{coinName} utilizzabili: {tempMaxCoins}
					</h6>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className="flex flex-col gap-[8px]">
						<label
							htmlFor="nomeSquadra"
							className="body-small font-semibold"
						>
							{isEdit ? "Aggiorna" : "Inserisci"} il nome della
							tua squadra:
						</label>
						<GenericInput
							type="text"
							id="nomeSquadra"
							name="nomeSquadra"
							value={tempTeam?.name}
							required={true}
							placeholder="Nome squadra"
							messageError={errors.nomeSquadra}
							handleChange={handleChangeName}
							handleBlur={handleBlurName}
						/>
					</div>
				</form>
				{!isEdit && (
					<>
						<ul className="flex flex-col gap-[16px]">
							{players.map((el, idx) => (
								<Player
									key={idx}
									playerObj={el}
									createTeam={true}
									canEdit={false}
									canAdd={canAdd}
									playersObj={tempTeam.players}
									onSelect={handleSelectPlayer}
									onDeselect={handleDeselectPlayer}
								/>
							))}
						</ul>
					</>
				)}

				<NormalButton
					text={isEdit ? "Aggiorna Squadra" : "Crea Squadra"}
					action={() => {}}
					disabled={!isFormValid()}
				/>
			</div>
		</div>
	);
}

export default ModalTeam;
