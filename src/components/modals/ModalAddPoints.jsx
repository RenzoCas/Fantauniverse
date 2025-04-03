import { useState, useEffect } from "react"; // Aggiungi useEffect
import TabButton from "../../atoms/Buttons/TabButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../../contexts/LeagueContext";
import Rule from "../Rule";
import NormalButton from "../../atoms/Buttons/NormalButton";

function ModalAddPoints({ isOpen, onClose, playerObj, onConfirm, dataDay }) {
	const [tabActive, setTabActive] = useState("Bonus");
	const { league } = useLeague();
	const { rules } = league;
	const { name } = playerObj;
	const [selectedRules, setSelectedRules] = useState([]);

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
				id="modalAddPoints"
				tabIndex="-1"
				aria-hidden={!isOpen}
				className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end transition-opacity duration-500 ease z-1000 ${
					isOpen ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
				onClick={onClose}
			></div>
			<div
				className={`fixed bottom-0 left-0 bg-white shadow-lg rounded-t-[12px] p-4 w-full transition-transform duration-500 ease flex flex-col gap-[4px] z-1001 max-h-[calc(100dvh-100px)] overflow-y-auto ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
				</button>
				<div className="flex flex-col gap-[16px] relative">
					<h5 className="body-normal font-semibold">
						Aggiungi bonus e malus a {name}
					</h5>
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
							.filter(
								(el) => el.malus === (tabActive === "Malus")
							)
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
						disabled={selectedRules.length == 0}
						classOpt="sticky bottom-0"
					/>
				</div>
			</div>
		</>
	);
}

export default ModalAddPoints;
