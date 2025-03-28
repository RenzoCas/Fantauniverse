import { useState } from "react";
import NormalButton from "../atoms/Buttons/NormalButton";
import Player from "../components/Player";
import { useLeague } from "../contexts/LeagueContext";
import ModalAddPoints from "../components/modals/ModalAddPoints";
import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import { useDay } from "../contexts/DayContext";
import Loader from "../components/Loader";
import GenericPopup from "../components/popups/GenericPopup";

function CreateDay() {
	const navigate = useNavigate();
	const { league } = useLeague();
	const { players } = league;
	const { updateDay } = useDay();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [playerObj, setPlayeObj] = useState(players[0]);
	const { state } = useLocation();
	const [dataDay, setDataDay] = useState({
		id: state?.id || null,
		players: [],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleAddPoints = (player) => {
		setPlayeObj(player);
		setIsModalOpen(true);
	};

	const confirmPlayerRules = async (player, selectedRules) => {
		await setDataDay((prev) => {
			const playerExists = prev.players.some(
				(p) => p.player.id === player.id
			);

			const updatedPlayers = playerExists
				? prev.players.map((p) =>
						p.player.id === player.id
							? {
									...p,
									rules: selectedRules.map((ruleId) => ({
										id: ruleId,
									})),
							  }
							: p
				  )
				: [
						...prev.players,
						{
							player: { id: player.id },
							rules: selectedRules.map((ruleId) => ({
								id: ruleId,
							})),
						},
				  ];

			return { ...prev, players: updatedPlayers };
		});
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		const result = await updateDay(dataDay);
		setIsLoading(false);
		if (!result) {
			showPopup(
				"error",
				"Errore nella creazione della giornata!",
				"La giornata non é stata aggiunta correttamente. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Giornata aggiunta!",
			"La giornata é stata creata correttamente."
		);
	};

	return (
		<>
			{isLoading && <Loader />}
			<div className="flex flex-col gap-[8px]">
				<button
					onClick={() => {
						navigate(-1);
					}}
					className="flex items-center gap-[4px] text-(--accent-normal)"
				>
					<ChevronLeftIcon className="h-[20px] w-[20px]" />
					<p className="body-normal">Indietro</p>
				</button>
				<div className="flex flex-col gap-[16px]">
					<h2 className="body-regular">
						Giornata:{" "}
						<span className="font-semibold">{state.name}</span>
					</h2>
					<ul className="flex flex-col gap-[12px]">
						{players.map((p) => (
							<Player
								key={p.id}
								playerObj={p}
								addPoints={true}
								dataDay={dataDay}
								handleAddPoints={handleAddPoints}
							></Player>
						))}
					</ul>
					<div className="flex flex-col gap-[8px] sticky bottom-[32px]">
						<NormalButton
							text="Conferma punteggi"
							icon={false}
							action={handleSubmit}
						/>
					</div>
				</div>
				<ModalAddPoints
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					playerObj={playerObj}
					dataDay={dataDay}
					onConfirm={confirmPlayerRules}
					startTabActive="Bonus"
				/>
			</div>
			<GenericPopup
				isOpen={popupData.isOpen}
				type={popupData.type}
				title={popupData.title}
				message={popupData.message}
			/>
		</>
	);
}

export default CreateDay;
