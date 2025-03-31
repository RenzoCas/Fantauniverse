import { useEffect, useState } from "react";
import GenericInput from "../atoms/Inputs/GenericInput";
import { useTeam } from "../contexts/TeamContext";
import { PiggyBank, Save } from "lucide-react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Player from "../components/Player";

function MyTeam() {
	const { team } = useTeam();
	const { id, name, players, position } = team;
	const { league } = useLeague();
	const { coinName, maxCoins, status, players: leaguePlayers } = league;
	const [formData, setFormData] = useState({
		id: id,
		name: name || "",
		players: players || [],
		position: position || 1,
	});

	const [tempTeam, setTempTeam] = useState({
		id: team?.id || null,
		name: team?.name || "",
		icon: team?.icon || null,
		players: team?.players || [],
	});

	const [errors, setErrors] = useState({});
	const [isEditing, setIsEditing] = useState({
		name: false,
		players: false,
	});

	const [tempMaxCoins, setTempMaxCoins] = useState(maxCoins);
	const [canAddPlayers, setCanAddPlayers] = useState({});
	const [isMaxPlayersReached, setIsMaxPlayersReached] = useState(false);

	useEffect(() => {
		setIsMaxPlayersReached(tempTeam.players.length >= 5);
	}, [tempTeam.players]);

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

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: value.trim() ? "" : "Campo obbligatorio",
		}));
	};

	const handleChangeData = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const toggleEditing = (field) => {
		setIsEditing((prev) => ({
			...Object.keys(prev).reduce((acc, key) => {
				acc[key] = key === field ? !prev[key] : false;
				return acc;
			}, {}),
		}));
	};

	useEffect(() => {
		console.log(league);
	}, []);

	return (
		<div className="flex flex-col gap-[24px]">
			<div className="flex flex-col gap-[12px]">
				{status == "NOT_STARTED" && (
					<div className="flex items-center justify-between gap-[8px]">
						<h2 className="title-h4 font-medium">
							Modifica squadra
						</h2>
						<p className="body-small font-semibold text-[#F87171] whitespace-nowrap">
							Cancella team
						</p>
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
								name={formData.name}
								value={formData.name}
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
									className={`break-words self-center px-[24px] py-[10px] body-normal`}
								>
									{formData.name}
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
							{tempTeam.players.length}/5
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
							canAdd={canAddPlayers[p.id] && !isMaxPlayersReached}
							canEdit={false}
							onSelect={handleSelectPlayer}
							onDeselect={handleDeselectPlayer}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}

export default MyTeam;
