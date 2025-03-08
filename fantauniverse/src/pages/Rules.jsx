import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Rule from "../components/Rule";
import ModalAddRule from "../components/modals/ModalAddRule";
import GenericPopup from "../components/popups/GenericPopup";

function Rules() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSuccessDelete, setIsSuccessDelete] = useState(false);
	const { league, deleteRule } = useLeague();
	const { rules, isAdmin } = league;

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
				<p className="body-normal font-semibold text-(--black-darker) text-center">
					Sembra che tu non abbia aggiunto nessuna regola.
				</p>
			)}
			{isAdmin && (
				<>
					<ModalAddRule
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/>

					<GenericPopup isOpen={isSuccessDelete} type="success">
						<p className="font-bold text-(--black-normal)">
							Regola eliminata correttamente
						</p>
					</GenericPopup>
				</>
			)}
		</>
	);
}

export default Rules;
