import { useState } from "react";
import TabButton from "../../atoms/Buttons/TabButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../../contexts/LeagueContext";
import Rule from "../Rule";
import NormalButton from "../../atoms/Buttons/NormalButton";

function ModalAddPoints({ isOpen, onClose }) {
	const [tabActive, setTabActive] = useState("Bonus");
	const { league } = useLeague();
	const { rules } = league;

	return (
		<div
			id="modalRule"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-t-[12px] p-4 w-full transition-transform duration-500 ease flex flex-col gap-[4px] z-100 max-h-[calc(100dvh-100px)] overflow-y-auto ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[24px] w-[24px]" />
				</button>
				<div className="flex flex-col gap-[16px]">
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
								/>
							))}
					</ul>

					<NormalButton
						action={() => {}}
						icon={false}
						text="Conferma"
					/>
				</div>
			</div>
		</div>
	);
}

export default ModalAddPoints;
