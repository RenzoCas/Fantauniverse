import { useState } from "react";
import NormalButton from "../atoms/Buttons/NormalButton";
import Player from "../components/Player";
import { useLeague } from "../contexts/LeagueContext";
import ModalAddPoints from "../components/modals/ModalAddPoints";
import { useNavigate } from "react-router";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";

function CreateDay() {
	const navigate = useNavigate();
	const { league } = useLeague();
	const { players } = league;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [playerObj, setPlayeObj] = useState(players[0]);
	const { state } = useLocation();
	const [dataDay, setDataDay] = useState({
		id: state?.id || null,
		players: [],
	});

	const handleAddPoints = (player) => {
		setPlayeObj(player);
		setIsModalOpen(true);
	};

	const confirmPlayerRules = async (player, selectedRules) => {
		await setDataDay((prev) => {
			const playerExists = prev.players.some((p) => p.id === player.id);

			const updatedPlayers = playerExists
				? prev.players.map((p) =>
						p.id === player.id ? { ...p, rules: selectedRules } : p
				  )
				: [...prev.players, { id: player.id, rules: selectedRules }];

			const updatedDataDay = { ...prev, players: updatedPlayers };
			return updatedDataDay;
		});
	};

	const handleSubmit = () => {
		console.log(dataDay);
	};

	return (
		<div className="flex flex-col gap-[8px]">
			<p>{dataDay.id}</p>
			<button
				onClick={() => {
					navigate(-1);
				}}
				className="flex items-center gap-[4px] text-(--accent-normal)"
			>
				<ArrowLeftCircleIcon className="h-[24px] w-[24px]" />
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
	);
}

export default CreateDay;
