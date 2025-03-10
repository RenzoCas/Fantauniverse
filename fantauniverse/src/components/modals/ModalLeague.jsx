import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useLeague } from "../../contexts/LeagueContext";
import GenericInput from "../../atoms/Inputs/GenericInput";
import NormalButton from "../../atoms/Buttons/NormalButton";
import Radio from "../../atoms/Inputs/Radio";

function ModalLeague({ isOpen, onClose, onCreate, initialState }) {
	const [formData, setFormData] = useState(
		initialState || {
			name: "",
			description: "",
			visibility: "PUBLIC",
			coinName: "",
			maxCoins: "",
		}
	);
	const [errors, setErrors] = useState({});
	const { createLeague, updateLeague } = useLeague();

	const visibilityObj = [
		{
			value: "PUBLIC",
			label: "Pubblica",
		},
		{
			value: "PRIVATE",
			label: "Privata",
		},
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "maxCoins") {
			if (!/^\d*$/.test(value)) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Inserisci un valore numerico",
				}));
				return;
			}

			const numericValue = Number(value);

			if (numericValue > 10000) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Il valore massimo è 10.000",
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
			formData.coinName.trim() !== "" &&
			formData.maxCoins !== "" &&
			formData.maxCoins > 0 &&
			!Object.values(errors).some((error) => error !== "")
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
		let result = null;
		if (initialState) {
			result = await updateLeague(formData);
		} else {
			result = await createLeague(formData);
		}
		onClose();

		if (result && !result.error) {
			onCreate(
				"success",
				`${
					initialState
						? "Lega aggiornata con successo!"
						: "Lega creata con successo!"
				}`
			);
			{
				!initialState &&
					setFormData({
						name: "",
						description: "",
						visibility: "PUBLIC",
						coinName: "",
						maxCoins: "",
					});
			}
		} else {
			onCreate(
				"error",
				result.error ||
					`${
						initialState
							? "Errore nell'aggiornamento della lega. Riprova."
							: "Errore nella creazione della lega. Riprova."
					}`
			);
		}
	};

	return (
		<div
			id="modalLeague"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end md:items-center transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-lg p-[16px] md:py-[24px] w-full transition-transform duration-500 ease flex flex-col gap-[4px] ${
					isOpen ? "translate-y-0" : "translate-y-full"
				} md:max-w-[600px] md:rounded-lg md:items-center md:justify-center`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[24px] w-[24px]" />
				</button>
				<div className="flex flex-col gap-[16px]">
					<h4 className="font-semibold text-(--black-normal)">
						{initialState ? "Aggiorna lega" : "Crea lega"}
					</h4>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-[16px] w-full"
					>
						<GenericInput
							type="text"
							required
							name="name"
							id="name"
							placeholder="Nome lega"
							messageError={errors.name}
							value={formData.name}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<GenericInput
							type="textarea"
							name="description"
							id="description"
							placeholder="Descrizione breve della lega"
							messageError={errors.description}
							value={formData.description}
							handleChange={handleChange}
						/>
						<div className="flex flex-col gap-[16px] md:flex-row">
							<GenericInput
								type="text"
								required
								name="coinName"
								id="coinName"
								placeholder="Nome moneta"
								messageError={errors.coinName}
								value={formData.coinName}
								handleChange={handleChange}
								handleBlur={handleBlur}
							/>
							<GenericInput
								type="text"
								required
								name="maxCoins"
								id="maxCoins"
								placeholder="Numero massimo di monete utilizzabili"
								messageError={errors.maxCoins}
								value={formData.maxCoins}
								handleChange={handleChange}
								handleBlur={handleBlur}
							/>
						</div>

						<div className="grid grid-cols-2">
							{visibilityObj.map((opt, idx) => (
								<Radio
									key={idx}
									id={`radio-${idx}`}
									name="visibility"
									value={opt.value}
									checked={opt.value === formData.visibility}
									handleChange={handleChange}
									label={opt.label}
								/>
							))}
						</div>
						<NormalButton
							text={initialState ? "Aggiorna lega" : "Crea lega"}
							action={handleSubmit}
							disabled={!isFormValid()}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}

export default ModalLeague;
