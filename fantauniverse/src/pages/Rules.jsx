import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useLeague } from "../contexts/LeagueContext";
import Rule from "../components/Rule";
import GenericPopup from "../components/popups/GenericPopup";
import TabButton from "../atoms/Buttons/TabButton";
import ModalRule from "../components/modals/ModalRule";
import NormalButton from "../atoms/Buttons/NormalButton";
import Loader from "../components/Loader";
import { useRule } from "../contexts/RuleContext";

function Rules() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [ruleObj, setRuleObj] = useState();
	const { league } = useLeague();
	const { rules, isAdmin, status } = league;
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const [tabActive, setTabActive] = useState("Bonus");
	const [isLoading, setIsLoading] = useState(false);
	const { addRule, deleteRule, updateRule } = useRule();

	const showPopup = (message, type) => {
		setPopupData({ isOpen: true, type: type, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type: type, message }),
			2000
		);
	};

	const handleDeleteRule = async (ruleId) => {
		setIsModalOpen(false);
		setIsLoading(true);
		await deleteRule(ruleId);
		setIsLoading(false);
		showPopup("Regola eliminata correttamente", "success");
	};

	const handleAddRule = async () => {
		setRuleObj(null);
		setIsModalOpen(true);
		setIsEdit(false);
	};

	const handleEditRule = async (ruleObj) => {
		setRuleObj(ruleObj);
		setIsModalOpen(true);
		setIsEdit(true);
	};

	const handleSubmitAdd = async (formData) => {
		setIsLoading(true);
		setIsModalOpen(false);
		const result = await addRule(formData);
		setIsLoading(false);
		if (!result) {
			showPopup("Errore nell'aggiunta della regola", "error");
			return;
		}
		showPopup("Regola aggiunta correttamente", "success");
	};

	const handleSubmitEdit = async (formData) => {
		setIsLoading(true);
		setIsModalOpen(false);
		const result = await updateRule(formData);
		setIsLoading(false);
		if (!result) {
			showPopup("Errore nell'aggiunta della regola", "error");
			return;
		}
		showPopup("Regola aggiunta correttamente", "success");
	};

	const handleTabChange = (tab) => {
		setTabActive(tab);
	};

	return (
		<>
			{isLoading && <Loader />}
			{rules.length > 0 ? (
				<>
					<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-dark)">
						<TabButton
							handleClick={() => handleTabChange("Bonus")}
							active={tabActive === "Bonus"}
						>
							<p className="body-normal">Bonus</p>
						</TabButton>
						<TabButton
							handleClick={() => handleTabChange("Malus")}
							active={tabActive === "Malus"}
						>
							<p className="body-normal">Malus</p>
						</TabButton>
					</div>

					{isAdmin && status === "PENDING" && (
						<>
							<div className="flex items-center gap-[8px] justify-between">
								<h6 className="body-regular font-semibold">
									Regole {tabActive}
								</h6>
								<div className="flex items-center gap-[8px] justify-end">
									<p className="body-small">
										Aggiungi regola
									</p>
									<button
										onClick={handleAddRule}
										className="p-[4px] bg-(--black-light) rounded-full"
									>
										<PlusIcon className="h-[16px] w-[16px]" />
									</button>
								</div>
							</div>
						</>
					)}

					<ul className="flex flex-col gap-[16px]">
						{rules
							.filter(
								(el) => el.malus === (tabActive === "Malus")
							)
							.map((el, idx) => (
								<Rule
									key={idx}
									ruleObj={el}
									onEdit={handleEditRule}
									canEdit={isAdmin && status === "PENDING"}
								/>
							))}
					</ul>
				</>
			) : (
				<div className="flex flex-col gap-[24px] items-center">
					<p className="body-normal font-semibold text-(--black-darker) text-center">
						Sembra che tu non abbia aggiunto nessuna regola.
					</p>
					<NormalButton
						text="Aggiungi Regola"
						action={handleAddRule}
					/>
				</div>
			)}

			{isAdmin && status === "PENDING" && (
				<>
					<ModalRule
						isOpen={isModalOpen}
						isEdit={isEdit}
						ruleObj={ruleObj}
						onClose={() => setIsModalOpen(false)}
						onSubmit={isEdit ? handleSubmitEdit : handleSubmitAdd}
						onDelete={handleDeleteRule}
						startTabActive={tabActive}
					/>
					<GenericPopup
						isOpen={popupData.isOpen}
						type={popupData.type}
					>
						<p className="font-bold text-(--black-normal)">
							{popupData.message}
						</p>
					</GenericPopup>
				</>
			)}
		</>
	);
}

export default Rules;
