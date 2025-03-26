import { useState } from "react";
import NormalButton from "../atoms/Buttons/NormalButton";
import Player from "../components/Player";
import { useLeague } from "../contexts/LeagueContext";
import ModalAddPoints from "../components/modals/ModalAddPoints";
import GhostButton from "../atoms/Buttons/GhostButton";
import { useNavigate } from "react-router";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

function CreateDay() {
	const navigate = useNavigate();
	const { league } = useLeague();
	const { players } = league;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [playerObj, setPlayeObj] = useState(players[0]);

	const handleAddPoints = (player) => {
		setPlayeObj(player);
		setIsModalOpen(true);
	};

	return (
		<>
			<div className="flex flex-col gap-[16px]">
				<h2 className="body-regular font-semibold">Seleziona player</h2>
				<ul className="flex flex-col gap-[12px]">
					{players.map((p) => (
						<Player
							key={p.id}
							playerObj={p}
							addPoints={true}
							handleAddPoints={handleAddPoints}
						></Player>
					))}
				</ul>
				<div className="flex flex-col gap-[8px] sticky bottom-[32px]">
					<NormalButton text="Conferma punteggi" icon={false} />
					<GhostButton
						text="Annulla"
						classOpt="border border-solid bg-white"
						customIcon={true}
						action={() => navigate(-1)}
					>
						<ArrowLeftCircleIcon className="h-[24px] w-[24px]" />
					</GhostButton>
				</div>
			</div>
			<ModalAddPoints
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				playerObj={playerObj}
				// onSubmit={isEdit ? handleSubmitEdit : handleSubmitAdd}
				startTabActive="Bonus"
			/>
		</>
	);
}

export default CreateDay;
