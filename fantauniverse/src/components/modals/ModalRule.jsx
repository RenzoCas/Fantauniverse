import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import NormalButton from "../../atoms/Buttons/NormalButton";
import GenericInput from "../../atoms/Inputs/GenericInput";
import TabButton from "../../atoms/Buttons/TabButton";
import GhostButton from "../../atoms/Buttons/GhostButton";

function ModalRule({
	isOpen,
	isEdit,
	ruleObj,
	onClose,
	onSubmit,
	onDelete,
	startTabActive,
}) {
	const [formData, setFormData] = useState({
		name: "",
		rule: "",
		value: "",
		malus: false,
	});
	const [errors, setErrors] = useState({});
	const [tabActive, setTabActive] = useState(startTabActive);

	useEffect(() => {
		if (ruleObj) {
			setFormData(ruleObj);
		} else {
			setFormData({
				name: "",
				rule: "",
				value: "",
				malus: false,
			});
		}
	}, [ruleObj]);

	useEffect(() => {
		if (isOpen) {
			setTabActive(startTabActive);
		}
	}, [isOpen, startTabActive]);

	const handleTabChange = (tab) => {
		setTabActive(tab);
		setFormData((prev) => ({
			...prev,
			malus: tab === "Malus",
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "value") {
			if (!/^\d*$/.test(value)) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Inserisci un valore numerico",
				}));
				return;
			}

			const numericValue = Number(value);
			if (numericValue > 100) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Il valore massimo è 100",
				}));
				return;
			} else {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "",
				}));
			}

			setFormData((prev) => ({
				...prev,
				[name]: numericValue,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const isFormValid = () => {
		return (
			formData.name.trim() !== "" &&
			formData.rule.trim() !== "" &&
			formData.value !== "" &&
			formData.value > 0
		);
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: value.trim() ? "" : "Campo obbligatorio",
		}));
	};

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
				className={`bg-white shadow-lg rounded-t-lg p-4 w-full transition-transform duration-500 ease flex flex-col gap-[4px] z-100 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[24px] w-[24px]" />
				</button>
				<div className="flex flex-col gap-[16px]">
					<h4 className="font-semibold text-(--black-normal)">
						{isEdit ? "Modifica" : "Aggiungi"} Regola
					</h4>
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
					<form
						onSubmit={(e) => {
							e.preventDefault();
						}}
						className="flex flex-col gap-4"
					>
						<GenericInput
							type="text"
							required
							name="name"
							id="name"
							placeholder="Nome regola"
							messageError={errors.name}
							value={formData.name}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<GenericInput
							type="textarea"
							required
							name="rule"
							id="rule"
							placeholder="Testo regola"
							messageError={errors.rule}
							value={formData.rule}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<GenericInput
							type="text"
							required
							name="value"
							id="value"
							placeholder="Punteggio regola"
							messageError={errors.value}
							value={formData.value}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<NormalButton
							text={
								isEdit ? "Modifica Regola" : "Aggiungi Regola"
							}
							action={() => {
								onSubmit(formData);
								setFormData({
									name: "",
									rule: "",
									value: "",
									malus: false,
								});
							}}
							disabled={!isFormValid()}
						/>
						{isEdit && (
							<GhostButton
								text="Elimina Regola"
								action={() => onDelete(ruleObj.id)}
								classOpt="text-(--error-normal)"
								customIcon={true}
							>
								<TrashIcon className="w-[24px] h-[24px]" />
							</GhostButton>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}

export default ModalRule;
