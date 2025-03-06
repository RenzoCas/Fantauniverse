import { useState } from "react";
import Rule from "../atoms/Rule";
import ModalAddRules from "./ModalAddRules";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";

function Rules({ isAdmin }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSuccessDelete, setIsSuccessDelete] = useState(false);
	const { league, deleteRule } = useLeague();
	const { rules } = league;

	const handleDeleteRule = async (ruleId) => {
		await deleteRule(ruleId);
		setIsSuccessDelete(true);
		setTimeout(() => {
			setIsSuccessDelete(false);
		}, 1000);
	};

	return (
		<>
			{isAdmin && (
				<div className="flex items-center gap-[8px] justify-end">
					<p className="body-small">Aggiungi regola</p>
					<button
						onClick={() => setIsModalOpen(true)}
						className="p-[4px] bg-(--black-light) rounded-full"
					>
						<PlusIcon className="h-[16px] w-[16px]" />
					</button>
				</div>
			)}
			{rules.length > 0 ? (
				<ul className="flex flex-col gap-[16px]">
					{rules.map((el, idx) => (
						<Rule
							key={idx}
							ruleObj={el}
							onDelete={handleDeleteRule}
							isAdmin={isAdmin}
						/>
					))}
				</ul>
			) : (
				<p>Non ci sono regole, aggiungile.</p>
			)}
			{isAdmin && (
				<>
					<ModalAddRules
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/>

					<div
						className={`flex items-center gap-[8px] bg-green-50 shadow-lg rounded-[16px] p-[24px] fixed transition-transform duration-500 ease z-100 w-[calc(100vw-32px)] md:max-w-[528px] ${
							isSuccessDelete
								? "transform translate-y-0 bottom-[32px]"
								: "transform translate-y-full bottom-0"
						}`}
					>
						<CheckIcon className="w-[24px] h-[24px] flex-shrink-0" />
						<p className="font-bold text-(--black-normal)">
							Regola eliminata correttamente
						</p>
					</div>
				</>
			)}
		</>
	);
}

export default Rules;
