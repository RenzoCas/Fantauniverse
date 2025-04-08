import { XMarkIcon } from "@heroicons/react/24/outline";
import NormalButton from "../../atoms/Buttons/NormalButton";
import GenericInput from "../../atoms/Inputs/GenericInput";
import { useEffect, useState } from "react";
import { useModal } from "../../contexts/ModalContext";

function ModalChangePassword({ isOpen, onClose }) {
	const [formData, setFormData] = useState({
		oldPassword: "",
		newPassword: "",
		confermaPassword: "",
	});

	const [errors, setErrors] = useState({});
	const { openBackdrop, closeBackdrop } = useModal();

	useEffect(() => {
		if (isOpen) {
			openBackdrop();
		} else {
			closeBackdrop();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

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
				className={`fixed bottom-0 left-0 bg-white shadow-lg rounded-t-[12px] p-[16px] lg:p-[24px] w-full transition-all duration-300 ease flex flex-col gap-[16px] z-1001 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:rounded-[12px] lg:max-w-[500px] ${
					isOpen
						? "scale-100 opacity-100 translate-y-0 lg:bottom-1/2 lg:translate-y-1/2 visible"
						: "scale-80 opacity-30 translate-y-full lg:translate-y-0 invisible"
				}`}
			>
				<div className="flex items-center justify-between gap-[8px]">
					<h4 className="body-normal font-semibold">
						Modifica password
					</h4>
					<button onClick={onClose}>
						<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0 cursor-pointer" />
					</button>
				</div>
				<form className="flex flex-col gap-[16px] relative">
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
				</form>
			</div>
		</>
	);
}

export default ModalChangePassword;
