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
		title: "",
		message: "",
	});
	const [tabActive, setTabActive] = useState("Bonus");
	const [isLoading, setIsLoading] = useState(false);
	const { addRule, deleteRule, updateRule } = useRule();

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleDeleteRule = async (ruleId) => {
		setIsModalOpen(false);
		setIsLoading(true);
		const response = await deleteRule(ruleId);
		setIsLoading(false);
		if (!response) {
			showPopup(
				"error",
				"Regola non eliminata",
				"La regola selezionata non é stata eliminato. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Regola eliminata",
			"La regola selezionata é stata eliminata correttamente."
		);
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
			showPopup(
				"error",
				"Errore nell'aggiunta della regola",
				"La regola non é stata aggiunta correttamente. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Regola aggiunta",
			"La regola é stata aggiunta correttamente."
		);
	};

	const handleSubmitEdit = async (formData) => {
		setIsLoading(true);
		setIsModalOpen(false);
		const result = await updateRule(formData);
		setIsLoading(false);
		if (!result) {
			showPopup(
				"error",
				"Errore nella modifica della regola",
				"La regola non é stata modificata correttamente. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Regola modificata",
			"La regola é stata modificata correttamente."
		);
	};

	const handleTabChange = (tab) => {
		setTabActive(tab);
	};

	return (
		<>
			{isLoading && <Loader />}
			{rules.length > 0 ? (
				<>
					<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-dark) lg:max-w-1/2 lg:mx-auto">
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
								<button
									onClick={handleAddRule}
									className="flex items-center gap-[8px] justify-end body-small"
								>
									Aggiungi regola
									<PlusIcon className="h-[24px] w-[24px] p-[4px] bg-(--black-light) rounded-full flex-shrink-0" />
								</button>
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
						text="Aggiungi regola"
						action={handleAddRule}
						customIcon={true}
					>
						<PlusIcon className="h-[24px] w-[24px] flex-shrink-0" />
					</NormalButton>
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
						title={popupData.title}
						message={popupData.message}
					/>
				</>
			)}
		</>
	);
}

export default Rules;
