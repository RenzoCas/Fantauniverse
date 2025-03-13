import { useLeague } from "../contexts/LeagueContext";
import Player from "../components/Player";
import { useState } from "react";
import GenericInput from "../atoms/Inputs/GenericInput";
import NormalButton from "../atoms/Buttons/NormalButton";
import GhostButton from "../atoms/Buttons/GhostButton";
import { useNavigate } from "react-router";

function CreateTeam({ isEdit, teamObj }) {
	const navigate = useNavigate();
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

	// const handleCreateTeam = () => {};
	// const handleEditTeam = () => {};
	// const handleDeleteTeam = () => {};

	return (
		<>
			<div className="flex flex-col gap-[16px] flex-1">
				<div className="flex flex-col gap-[4px]">
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
						<p className="body-small font-semibold">
							Scegli i tuoi player:
						</p>
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
					classOpt="sticky bottom-[32px] mt-auto"
				/>
				<GhostButton text="Annulla" action={() => navigate(-1)} />
			</div>
		</>
	);
}

export default CreateTeam;
