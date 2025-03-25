import { useState } from "react";
import NormalButton from "../atoms/Buttons/NormalButton";
import Player from "../components/Player";
import { useLeague } from "../contexts/LeagueContext";
import ModalAddPoints from "../components/modals/ModalAddPoints";

function CreateDay() {
	const { league } = useLeague();
	const { players } = league;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleAddPoints = () => {
		setIsModalOpen(true);
	};

	return (
		<>
			<div className="flex flex-col gap-[16px]">
				<h2 className="title-h4 font-semibold">Seleziona player</h2>
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
				<NormalButton
					text="Crea giornata"
					classOpt="sticky bottom-[32px]"
				/>
			</div>
			<ModalAddPoints
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				// onSubmit={isEdit ? handleSubmitEdit : handleSubmitAdd}
				startTabActive="Bonus"
			/>
		</>
	);
}

export default CreateDay;
