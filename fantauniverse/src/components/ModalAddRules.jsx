import { XMarkIcon } from "@heroicons/react/24/outline";
import GenericInput from "../atoms/Inputs/GenericInput";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import NormalButton from "../atoms/Buttons/NormalButton";
import Checkbox from "../atoms/Inputs/Checkbox";

function ModalAddRules({ isOpen, onClose, leagueId, onAddRule }) {
	const [formData, setFormData] = useState({
		name: "",
		rule: "",
		malus: false,
		value: "",
	});
	const [errors, setErrors] = useState({});
	const [isSuccess, setIsSuccess] = useState(null);
	const { user, urlServer } = useAuth();
	const [resultText, setResultText] = useState();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (type === "checkbox") {
			setFormData((prevData) => ({
				...prevData,
				[name]: checked,
			}));
		} else if (name === "value") {
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
				[name]: value,
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
		try {
			const response = await fetch(
				`${urlServer}/league/action/addRules`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ leagueId, rules: [formData] }),
				}
			);

			if (!response.ok) {
				if (response.status === 409) {
					setResultText("Titolo regola giá presente.");
					throw new Error("Titolo regola giá presente.");
				}

				setResultText("Errore nell'aggiunta della regola.");
				throw new Error("Errore nell'aggiunta della regola.");
			}

			const result = await response.json();
			setResultText("Regola aggiunta con successo.");
			onAddRule(result.rules);
			setIsSuccess(true);
		} catch (error) {
			setResultText("Errore nell'aggiunta della regola.");
			setIsSuccess(false);
			console.log(error.message);
		}
	};

	return (
		<div
			id="modalAddRules"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-end transition-opacity duration-500 ease ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-t-lg p-4 w-full transition-transform duration-500 ease flex flex-col gap-6 z-100 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-5 w-5" />
				</button>
				{isSuccess === true ? (
					<>
						<p className="text-black font-semibold">{resultText}</p>
						<NormalButton
							text="Chiudi"
							action={() => {
								onClose();
								setIsSuccess(null);
								setFormData({
									name: "",
									rule: "",
									malus: false,
									value: "",
								});
							}}
						/>
					</>
				) : isSuccess === false ? (
					<>
						<p className="text-red-500 font-semibold">
							{resultText}
						</p>
						<NormalButton
							text="Riprova"
							action={() => setIsSuccess(null)}
						/>
					</>
				) : (
					<>
						<h4 className="font-semibold text-black">
							Aggiungi le tue regole
						</h4>
						<form
							onSubmit={handleSubmit}
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
							<div className="flex align-start gap-[10px]">
								<Checkbox
									name="malus"
									id="malus"
									messageError={errors.malus}
									label="Questa regola é un malus (punteggio negativo)"
									checked={formData.malus}
									handleChange={handleChange}
								/>
							</div>
							<NormalButton
								text="Aggiungi Regole"
								action={handleSubmit}
								disabled={!isFormValid()}
							/>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

export default ModalAddRules;
