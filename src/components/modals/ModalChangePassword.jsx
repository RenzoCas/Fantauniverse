import { XMarkIcon } from "@heroicons/react/24/outline";
import NormalButton from "../../atoms/Buttons/NormalButton";
import GenericInput from "../../atoms/Inputs/GenericInput";
import { useState } from "react";

function ModalChangePassword({ isOpen, onClose }) {
	const [formData, setFormData] = useState({
		oldPassword: "",
		newPassword: "",
		confermaPassword: "",
	});

	const [errors, setErrors] = useState({});

	const isFormValid = () => {
		return (
			validatePassword(formData.oldPassword) &&
			validatePassword(formData.newPassword) &&
			validatePassword(formData.confermaPassword) &&
			formData.newPassword === formData.confermaPassword
		);
	};

	const validatePassword = (password) =>
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(
			password
		);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		let error = "";
		if (!validatePassword(value)) {
			error =
				"La password deve contenere almeno 8 caratteri, una maiuscola, un numero e un carattere speciale.";
		} else if (
			name === "confermaPassword" &&
			value !== formData.newPassword
		) {
			error = "Le password non coincidono.";
		}

		setErrors({ ...errors, [name]: error });
	};

	const handleSubmit = () => {
		const filteredData = Object.fromEntries(
			Object.entries(formData).filter(
				([key]) => key !== "confermaPassword"
			)
		);
		console.log("Dati inviati:", filteredData);
	};

	return (
		<>
			<div
				id="ModalChangePassword"
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
					<XMarkIcon className="h-[24px] w-[24px]" />
				</button>
				<div className="flex flex-col gap-[16px] relative">
					<h5 className="body-normal font-semibold">
						Modifica password
					</h5>
					<GenericInput
						type="password"
						required
						name="oldPassword"
						id="oldPassword"
						placeholder="Vecchia password"
						messageError={errors.oldPassword}
						value={formData.oldPassword}
						handleChange={handleChange}
						handleBlur={handleBlur}
						autocomplete="new-password"
					/>
					<GenericInput
						type="password"
						required
						name="newPassword"
						id="newPassword"
						placeholder="Nuova password"
						messageError={errors.newPassword}
						value={formData.newPassword}
						handleChange={handleChange}
						handleBlur={handleBlur}
						autocomplete="new-password"
					/>
					<GenericInput
						type="password"
						required
						name="confermaPassword"
						id="confermaPassword"
						placeholder="Conferma Password"
						messageError={errors.confermaPassword}
						value={formData.confermaPassword}
						handleChange={handleChange}
						handleBlur={handleBlur}
						autocomplete="new-password"
					/>
					<NormalButton
						icon={false}
						text="Aggiorna la password"
						disabled={!isFormValid()}
						action={handleSubmit}
					/>
				</div>
			</div>
		</>
	);
}

export default ModalChangePassword;
