import { useLeague } from "../contexts/LeagueContext";
import Player from "../components/Player";
import { useState, useEffect, useRef } from "react";
import GenericInput from "../atoms/Inputs/GenericInput";
import NormalButton from "../atoms/Buttons/NormalButton";
import {
	UserGroupIcon,
	PencilSquareIcon,
	ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import Loader from "../components/Loader";
import { useTeam } from "../contexts/TeamContext";
import { useNavigate } from "react-router";
import GenericPopup from "../components/popups/GenericPopup";
import { useUser } from "../contexts/UserContext";

function ViewTeam() {
	const { league } = useLeague();
	const { user } = useUser();
	const {
		team,
		teamParticipant,
		createTeam,
		getMyTeam,
		updateTeam,
		resetTeamPartecipant,
	} = useTeam();
	const { maxCoins, coinName, players, status, id, participants } = league;
	const participant = participants.find((p) => p.user.id === user.id);

	const [tempTeam, setTempTeam] = useState({
		referredTo: { id: participant?.id },
		id: teamParticipant?.id || team?.id || null,
		name: teamParticipant?.name || team?.name || "",
		icon: teamParticipant?.icon || team?.icon || null,
		players: teamParticipant?.players || team?.players || [],
	});
	const [tempMaxCoins, setTempMaxCoins] = useState(maxCoins);
	const [errors, setErrors] = useState({});
	const [canAddPlayers, setCanAddPlayers] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

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

	useEffect(() => {
		return () => {
			if (resetTeamPartecipant) {
				resetTeamPartecipant();
			}
		};
	}, []);

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

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

	const updateCanAddPlayers = (updatedPlayers, newMaxCoins) => {
		const newCanAddState = {};

		players.forEach((player) => {
			const isAlreadySelected = updatedPlayers.some(
				(p) => p.id === player.id
			);
			const canAfford = player.price <= newMaxCoins;
			newCanAddState[player.id] = isAlreadySelected || canAfford;
		});

		setCanAddPlayers(newCanAddState);
	};

	const handleSelectPlayer = (player) => {
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

	const handleUpdateImage = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (event) => {
		try {
			const file = event.target.files[0];
			if (
				file &&
				(file.type === "image/jpeg" || file.type === "image/png")
			) {
				const reader = new FileReader();
				reader.onloadend = async () => {
					const base64Image = reader.result.split(",")[1];
					setIsLoading(true);

					// Make sure res is properly checked, log it for debugging
					setTempTeam((prev) => ({
						...prev,
						icon: base64Image,
					}));
					setIsLoading(false);
				};
				reader.readAsDataURL(file);
			} else {
				throw new Error("Per favore seleziona un file JPEG o PNG.");
			}
		} catch (error) {
			showPopup(
				"error",
				"Errore nell'aggiornamento dell'immagine!",
				`${error.message}`
			);
		}
	};

	const handleSubmitTeam = async () => {
		setIsLoading(true);
		let res = null;
		if (team) {
			res = await updateTeam(tempTeam);
		} else {
			res = await createTeam(tempTeam);
		}

		await getMyTeam(id);

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

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="flex flex-col gap-[16px] flex-1">
					<button
						onClick={() => {
							navigate(-1);
						}}
						className="flex items-center gap-[4px] text-(--accent-normal)"
					>
						<ArrowLeftCircleIcon className="h-[24px] w-[24px]" />
						<p className="body-normal">Indietro</p>
					</button>
					<div className="flex flex-col gap-[4px]">
						{status == "NOT_STARTED" ? (
							<>
								<h1 className="title-h4 font-semibold text-(--black-normal)">
									{tempTeam ? "Modifica" : "Crea"} la tua
									squadra
								</h1>
							</>
						) : (
							<>
								<h1 className="title-h4 font-semibold text-(--black-normal)">
									{tempTeam.name}
								</h1>
							</>
						)}
					</div>

					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex flex-col gap-[8px]"
					>
						{status === "NOT_STARTED" && (
							<input
								type="file"
								name="logoSquadra"
								id="logoSquadra"
								accept="image/jpeg, image/png"
								onChange={handleFileChange}
								ref={fileInputRef}
								className="hidden"
							/>
						)}
						<picture
							className="relative w-full rounded-[8px]"
							onClick={handleUpdateImage}
						>
							<img
								src={
									tempTeam?.icon != null
										? `data:image/png;base64,${tempTeam?.icon}`
										: "https://placehold.co/360x202"
								}
								alt="Logo lega"
								className="w-full rounded-[8px] h-auto object-cover"
								style={{ cursor: "pointer" }}
							/>
							{status === "NOT_STARTED" && (
								<div className="absolute bottom-[8px] right-[8px] p-[10px] rounded-full bg-(--black-light)">
									<PencilSquareIcon className="h-[20px] w-[20px]" />
								</div>
							)}
						</picture>
						{status == "NOT_STARTED" && (
							<>
								<label
									htmlFor="nomeSquadra"
									className="body-small font-semibold"
								>
									{team
										? "Aggiorna il nome della squadra:"
										: "Inserisci il nome della tua squadra:"}
								</label>
								<GenericInput
									id="nomeSquadra"
									required
									value={tempTeam?.name}
									placeholder="Nome squadra"
									messageError={errors.nomeSquadra}
									handleChange={handleChangeName}
									handleBlur={handleBlurName}
									disabled={status == "Avviata"}
								/>
							</>
						)}
					</form>
					{status == "NOT_STARTED" && (
						<>
							<h2 className="body-normal font-semibold">
								Scegli i tuoi player -{" "}
								<span className="body-small">
									{tempMaxCoins} {coinName} rimasti
								</span>
							</h2>
						</>
					)}

					<ul className="flex flex-col gap-[8px]">
						{tempTeam && status != "NOT_STARTED" ? (
							<>
								{tempTeam.players.map((player) => (
									<Player
										key={player.id}
										playerObj={player}
										playerActive={true}
									/>
								))}
							</>
						) : (
							<>
								{players.map((player) => (
									<Player
										key={player.id}
										playerObj={player}
										createTeam={true}
										canEdit={false}
										canAdd={canAddPlayers[player.id]}
										playersObj={tempTeam.players}
										onSelect={handleSelectPlayer}
										onDeselect={handleDeselectPlayer}
									/>
								))}
							</>
						)}
					</ul>

					{status == "NOT_STARTED" && (
						<NormalButton
							text={team ? "Aggiorna Squadra" : "Crea Squadra"}
							disabled={
								!tempTeam?.name?.trim() ||
								tempTeam?.players?.length === 0 ||
								tempMaxCoins < 0
							}
							action={handleSubmitTeam}
							classOpt="sticky bottom-[32px] mt-auto"
							customIcon={true}
						>
							<UserGroupIcon className="h-[24px] w-[24px]" />
						</NormalButton>
					)}

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

export default ViewTeam;
