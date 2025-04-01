import { useEffect, useState } from "react";
import GenericInput from "../atoms/Inputs/GenericInput";
import { useTeam } from "../contexts/TeamContext";
import { Award, PiggyBank, Save } from "lucide-react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Player from "../components/Player";
import Loader from "../components/Loader";
import GenericPopup from "../components/popups/GenericPopup";
import ModalConfirmAction from "../components/modals/ModalConfirmAction";
import NormalButton from "../atoms/Buttons/NormalButton";
import { useUser } from "../contexts/UserContext";

function MyTeam() {
	const { user } = useUser();
	const { team, createTeam, updateTeam, deleteTeam } = useTeam();
	const { league } = useLeague();
	const {
		coinName,
		maxCoins,
		status,
		players: leaguePlayers,
		participants,
		teamMaxPlayers,
		enableCaptain,
	} = league;
	const participant = participants.find((p) => p.user.id === user.id);

	const [tempTeam, setTempTeam] = useState({
		referredTo: { id: participant?.id },
		id: team?.id || null,
		name: team?.name || "",
		players: team?.players || [],
		playerDay: team?.playerDay || [],
	});

	const [errors, setErrors] = useState({});
	const [isEditing, setIsEditing] = useState({
		name: false,
	});

	const [tempMaxCoins, setTempMaxCoins] = useState(maxCoins);
	const [canAddPlayers, setCanAddPlayers] = useState({});
	const [isMaxPlayersReached, setIsMaxPlayersReached] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const [isModalConfirmOpen, setIsModalConfirmOpen] = useState({
		action: null,
		value: false,
	});
	const [dataModalConfirm, setDataModalConfirm] = useState({
		title: "",
		text: "",
		conferma: "",
		annulla: "",
	});
	const isEditingAnyField = Object.values(isEditing).some(
		(isEditing) => isEditing
	);

	useEffect(() => {
		setIsMaxPlayersReached(tempTeam.players.length >= teamMaxPlayers);
	}, [tempTeam.players, teamMaxPlayers]);

	useEffect(() => {
		if (team) {
			const initialPlayers = team.players || [];
			const initialMaxCoins =
				maxCoins - initialPlayers.reduce((sum, p) => sum + p.price, 0);
			setTempTeam((prevTeam) => ({
				...prevTeam,
				players: initialPlayers,
			}));
			setTempMaxCoins(initialMaxCoins);
			updateCanAddPlayers(initialPlayers, initialMaxCoins);
		}
	}, [team, maxCoins]);

	useEffect(() => {
		updateCanAddPlayers(tempTeam.players, tempMaxCoins);
	}, [tempTeam.players, tempMaxCoins]);

	const updateCanAddPlayers = (updatedPlayers, newMaxCoins) => {
		const newCanAddState = {};

		leaguePlayers.forEach((player) => {
			const isAlreadySelected = updatedPlayers.some(
				(p) => p.id === player.id
			);
			const canAfford = player.price <= newMaxCoins;
			newCanAddState[player.id] = isAlreadySelected || canAfford;
		});

		setCanAddPlayers(newCanAddState);
	};

	const handleSelectPlayer = (player) => {
		if (isMaxPlayersReached) return;

		const newMaxCoins = tempMaxCoins - player.price;
		const newPlayers = [...tempTeam.players, player];

		setTempTeam((prevTeam) => ({
			...prevTeam,
			players: newPlayers,
		}));

		setTempMaxCoins(newMaxCoins);
		updateCanAddPlayers(newPlayers, newMaxCoins);
	};

	const handleDeselectPlayer = (player) => {
		const newPlayers = tempTeam.players.filter((p) => p.id !== player.id);
		const newMaxCoins = tempMaxCoins + player.price;

		setTempTeam((prevTeam) => ({
			...prevTeam,
			players: newPlayers,
		}));

		setTempMaxCoins(newMaxCoins);

		setTimeout(() => updateCanAddPlayers(newPlayers, newMaxCoins), 0);
	};

	const handleSelectCaptain = (player) => {
		setTempTeam((prevTeam) => ({
			...prevTeam,
			players: prevTeam.players.map((p) =>
				p.id === player.id
					? { ...p, isCaptain: true }
					: { ...p, isCaptain: false }
			),
		}));
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: value.trim() ? "" : "Campo obbligatorio",
		}));
	};

	const handleChangeData = (e) => {
		const { name, value } = e.target;
		setTempTeam({ ...tempTeam, [name]: value });
	};

	const toggleEditing = (field) => {
		setIsEditing((prev) => ({
			...Object.keys(prev).reduce((acc, key) => {
				acc[key] = key === field ? !prev[key] : false;
				return acc;
			}, {}),
		}));
	};

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const isFormValid = () => {
		return (
			tempTeam.name.trim() !== "" &&
			isMaxPlayersReached &&
			!Object.values(errors).some((error) => error !== "") &&
			(!enableCaptain || tempTeam.players.some((p) => p.isCaptain))
		);
	};

	const handleSubmitTeam = async () => {
		setIsLoading(true);
		let res = null;
		if (team) {
			res = await updateTeam(tempTeam);
		} else {
			res = await createTeam(tempTeam);
		}

		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore nella creazione della squadra!",
				"La creazione della squadra non é andata a buon fine. Riprova."
			);
		}

		setIsLoading(false);
		const totalCost = res.players.reduce((acc, p) => acc + p.price, 0);
		setTempMaxCoins(maxCoins - totalCost);
		setTempTeam(res);

		if (team) {
			showPopup(
				"success",
				"Squadra aggiornata!",
				"L'aggiornamento della squadra é andato a buon fine."
			);
		} else {
			showPopup(
				"success",
				"Squadra creata!",
				"La squadra é stata creata con successo."
			);
		}
	};

	const showModalConfirmDelete = () => {
		setDataModalConfirm({
			title: "Elimina team",
			text: "Confermando questo team verrá eliminato definitivamente.",
			conferma: "Conferma",
			annulla: "Annulla",
		});
		setIsModalConfirmOpen({ action: "delete", value: true });
	};

	const handleDeleteTeam = async () => {
		setIsModalConfirmOpen({ action: null, value: false });
		setIsLoading(true);
		const res = await deleteTeam();
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore!",
				"L'eliminazione del team non é andata a buon fine. Riprova."
			);
			return;
		}

		setTempTeam({
			referredTo: { id: participant?.id },
			id: null,
			name: "",
			players: [],
		});

		setTempMaxCoins(maxCoins);

		setIsLoading(false);
		showPopup(
			"success",
			"Cancellazione effettuata!",
			"Il team é stato eliminato correttamente."
		);
	};

	return (
		<>
			{isLoading && <Loader />}
			{status != "NOT_STARTED" ? (
				<div className="flex flex-col gap-[24px]">
					<div className="flex flex-col gap-[8px]">
						<h2 className="title-h4 font-medium break-all">
							{team.name}
						</h2>
						<div className="flex items-center gap-[10px]">
							<Award className="h-[24px] w-[24px] stroke-[#B01DFF]" />
							<p className="body-regular">
								{team.position}o Posto
							</p>
						</div>
					</div>

					<ul className="flex flex-col gap-[8px]">
						{tempTeam.players.map((p, idx) => (
							<Player
								key={p.id}
								playersObj={tempTeam.players}
								playerDay={tempTeam.playerDay[idx]}
								playerObj={p}
								onSelect={handleSelectPlayer}
								onDeselect={handleDeselectPlayer}
								viewTeam={true}
							/>
						))}
					</ul>
				</div>
			) : (
				<div className="flex flex-col gap-[24px]">
					<div className="flex flex-col gap-[12px]">
						{status == "NOT_STARTED" && (
							<div className="flex items-center justify-between gap-[8px]">
								<h2 className="title-h4 font-medium">
									{!tempTeam.id ? "Crea" : "Modifica"} squadra
								</h2>
								{tempTeam.id && (
									<button
										className="body-small font-semibold text-[#F87171] whitespace-nowrap"
										onClick={() => showModalConfirmDelete()}
									>
										Cancella team
									</button>
								)}
							</div>
						)}

						<div className="flex flex-col gap-[8px]">
							<label
								htmlFor="name"
								className="body-normal text-(--black-light-active) font-medium"
							>
								Nome:
							</label>
							<div className="flex gap-[10px]">
								<button
									className="p-[10px] bg-(--black-light) rounded-full max-h-fit"
									onClick={() => toggleEditing("name")}
								>
									{isEditing.name ? (
										<Save className="h-[20px] w-[20px]" />
									) : (
										<PencilSquareIcon className="h-[20px] w-[20px]" />
									)}
								</button>
								{isEditing.name ? (
									<GenericInput
										type="text"
										required
										placeholder={`Nome team`}
										name="name"
										value={tempTeam.name}
										handleChange={handleChangeData}
										handleBlur={handleBlur}
										messageError={errors.name}
										autoFocus={true}
										maxLength={50}
									></GenericInput>
								) : (
									<div
										className={`bg-[#FAF8F8] w-full rounded-[16px] flex items-center gap-[4px] justify-between`}
									>
										<p
											className={`break-all self-center px-[24px] py-[10px] body-normal`}
										>
											{tempTeam.name}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-[8px]">
						<div className="flex items-center justify-between gap-[8px]">
							<p className="body-normal text-(--black-light-active) font-medium break-word">
								Seleziona giocatori:
							</p>
							<div
								className={`py-[2px] px-[8px] rounded-[4px] ${
									isMaxPlayersReached
										? "bg-(--accent-normal)"
										: "bg-(--error-light)"
								}`}
							>
								<p
									className={`body-normal font-semibold ${
										isMaxPlayersReached
											? "text-white"
											: "text-(--error-normal)"
									}`}
								>
									{tempTeam.players.length}/{teamMaxPlayers}
								</p>
							</div>
						</div>
						<div className="w-full flex gap-[8px] items-center justify-center bg-(--black-light) rounded-[4px] px-[12px] py-[4px]">
							<PiggyBank className="stroke-(--black-normal) h-[24px] w-[24px]" />
							<p className="body-small font-medium">
								{tempMaxCoins}/{maxCoins} {coinName}
							</p>
						</div>
						<ul className="flex flex-col gap-[8px]">
							{leaguePlayers.map((p) => (
								<Player
									key={p.id}
									playersObj={tempTeam.players}
									playerObj={p}
									createTeam={true}
									canAdd={
										canAddPlayers[p.id] &&
										!isMaxPlayersReached
									}
									canEdit={false}
									onSelect={handleSelectPlayer}
									onDeselect={handleDeselectPlayer}
									onSelectCaptain={handleSelectCaptain}
								/>
							))}
						</ul>
						<NormalButton
							text="Conferma"
							action={handleSubmitTeam}
							disabled={!isFormValid() || isEditingAnyField}
							icon={false}
						/>
					</div>
					<ModalConfirmAction
						isOpen={isModalConfirmOpen.value}
						dataModal={dataModalConfirm}
						onClose={() =>
							setIsModalConfirmOpen({
								action: null,
								value: false,
							})
						}
						onConfirmAction={handleDeleteTeam}
					></ModalConfirmAction>
					<GenericPopup
						isOpen={popupData.isOpen}
						type={popupData.type}
						title={popupData.title}
						message={popupData.message}
					/>
				</div>
			)}
		</>
	);
}

export default MyTeam;
