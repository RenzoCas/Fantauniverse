import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useLeague } from "../../contexts/LeagueContext";
import NormalButton from "../../atoms/Buttons/NormalButton";
import Checkbox from "../../atoms/Inputs/Checkbox";
import GenericInput from "../../atoms/Inputs/GenericInput";

function ModalAddRule({ isOpen, onClose, showPopup }) {
	const [formData, setFormData] = useState({
		name: "",
		rule: "",
		value: "",
		malus: false,
	});
	const [errors, setErrors] = useState({});
	const { addRule } = useLeague();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

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

			setFormData({
				...formData,
				[name]: numericValue,
			});
		} else {
			setFormData({
				...formData,
				[name]: type === "checkbox" ? checked : value,
			});
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

	const handleSubmit = async (e) => {
		e.preventDefault();

		const result = await addRule(formData);
		onClose();
		setFormData({ name: "", rule: "", value: "", malus: false });
		if (!result) {
			showPopup("Errore nell'aggiunta della regola", "error");
			return;
		}
		showPopup("Regola aggiunta correttamente", "success");
	};

	return (
		<div
			id="ModalAddRule"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-t-lg p-4 w-full transition-transform duration-500 ease flex flex-col gap-6 z-100 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[24px] w-[24px]" />
				</button>
				<h4 className="font-semibold text-(--black-normal)">
					Aggiungi Regola
				</h4>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
					<div className="flex align-start gap-[10px]">
						<Checkbox
							name="malus"
							id="malus"
							label="Questa regola è un malus (punteggio negativo)"
							checked={formData.malus}
							handleChange={handleChange}
						/>
					</div>
					<NormalButton
						text="Aggiungi Regola"
						action={handleSubmit}
						disabled={!isFormValid()}
					/>
				</form>
			</div>
		</div>
	);
}

export default ModalAddRule;
