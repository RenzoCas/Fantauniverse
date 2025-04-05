import { useState, useEffect } from "react"; // Aggiungi useEffect
import TabButton from "../../atoms/Buttons/TabButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../../contexts/LeagueContext";
import Rule from "../Rule";
import NormalButton from "../../atoms/Buttons/NormalButton";
import { useModal } from "../../contexts/ModalContext";

function ModalAddPoints({ isOpen, onClose, playerObj, onConfirm, dataDay }) {
	const [tabActive, setTabActive] = useState("Bonus");
	const { league } = useLeague();
	const { rules } = league;
	const { name } = playerObj;
	const [selectedRules, setSelectedRules] = useState([]);
	const { openBackdrop, closeBackdrop } = useModal();

	useEffect(() => {
		if (isOpen) {
			openBackdrop();
		} else {
			closeBackdrop();
		}
	}, [isOpen]);

	useEffect(() => {
		if (dataDay?.players) {
			const player = dataDay.players.find(
				(p) => p.player.id === playerObj.id
			);
			if (player) {
				setSelectedRules(player.rules.map((ruleObj) => ruleObj.id));
			} else {
				setSelectedRules([]);
			}
		}
	}, [dataDay, playerObj.id]);

	return (
		<>
			<div
				className={`fixed bottom-0 left-0 bg-white shadow-lg rounded-t-[12px] p-[16px] lg:p-[24px] w-full transition-all duration-300 ease flex flex-col gap-[16px] z-1001 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:rounded-[12px] lg:max-w-[500px] ${
					isOpen
						? "scale-100 opacity-100 translate-y-0 lg:bottom-1/2 lg:translate-y-1/2 visible"
						: "scale-80 opacity-30 translate-y-full lg:translate-y-0 invisible"
				}`}
			>
				<div className="flex items-center justify-between gap-[8px]">
					<h4 className="body-normal font-semibold">
						Aggiungi bonus e malus a {name}
					</h4>
					<button onClick={onClose}>
						<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
					</button>
				</div>

				<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-dark)">
					<TabButton
						handleClick={() => setTabActive("Bonus")}
						active={tabActive === "Bonus"}
					>
						<p className="body-normal">Bonus</p>
					</TabButton>
					<TabButton
						handleClick={() => setTabActive("Malus")}
						active={tabActive === "Malus"}
					>
						<p className="body-normal">Malus</p>
					</TabButton>
				</div>

				<ul className="flex flex-col gap-[16px]">
					{rules
						.filter((el) => el.malus === (tabActive === "Malus"))
						.map((el, idx) => (
							<Rule
								key={`${el.name}-${idx}`}
								ruleObj={el}
								isAddPoints={true}
								selectedRules={selectedRules}
								setSelectedRules={setSelectedRules}
							/>
						))}
				</ul>
				<NormalButton
					action={() => {
						onConfirm(playerObj, selectedRules);
						onClose();
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
