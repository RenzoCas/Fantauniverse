import { useState } from "react";
import { useNavigate } from "react-router";
import GhostButton from "../atoms/Buttons/GhostButton";
import NormalButton from "../atoms/Buttons/NormalButton";
import GenericInput from "../atoms/Inputs/GenericInput";
import Logo from "../atoms/Logo";
import Checkbox from "../atoms/Inputs/Checkbox";

export default function Registrazione() {
	const messageError = "Campo obbligatorio";
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		nome: "",
		email: "",
		password: "",
		confermaPassword: "",
		privacy: false,
	});

	const [errors, setErrors] = useState({});

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const validatePassword = (password) => {
		const regex =
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
		return regex.test(password);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		let error = "";

		if (!value && name !== "privacy") {
			error = messageError;
		} else if (name === "email" && !validateEmail(value)) {
			error = "Email non valida";
		} else if (name === "password" && !validatePassword(value)) {
			error =
				"La password deve contenere almeno 8 caratteri, una maiuscola, un numero e un carattere speciale";
		} else if (name === "confermaPassword" && value !== formData.password) {
			error = "Le password non coincidono";
		}

		setErrors({ ...errors, [name]: error });
	};

	const isFormValid = () => {
		return (
			formData.nome &&
			validateEmail(formData.email) &&
			validatePassword(formData.password) &&
			formData.password === formData.confermaPassword &&
			formData.privacy
		);
	};

	return (
		<>
			<header className="relative h-[46px] border-b-[2px] border-b-(--black-normal)">
				<div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]">
					<Logo />
				</div>
			</header>
			<main className="md:max-w-sm flex flex-col justify-center gap-[32px] mx-auto py-[40px] px-[16px] min-h-dvh">
				<h2 className="title-h2 font-semibold">Registrazione utente</h2>
				<form action="" className="flex flex-col gap-[32px]">
					<div className="flex flex-col gap-[10px]">
						<GenericInput
							type="text"
							required={true}
							name="nome"
							id="nomeUtente"
							placeholder="Nome Utente"
							messageError={errors.nome}
							value={formData.nome}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<GenericInput
							type="email"
							required={true}
							name="email"
							id="emailUtente"
							placeholder="Email"
							messageError={errors.email}
							value={formData.email}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<GenericInput
							type="password"
							required={true}
							name="password"
							id="passwordUtente"
							placeholder="Password"
							messageError={errors.password}
							value={formData.password}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<GenericInput
							type="password"
							required={true}
							name="confermaPassword"
							id="confermaPasswordUtente"
							placeholder="Conferma Password"
							messageError={errors.confermaPassword}
							value={formData.confermaPassword}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<div className="flex align-start gap-[10px]">
							<Checkbox
								name="privacy"
								id="privacyPolicy"
								required={true}
								messageError={messageError}
								label="Acconsento al trattamento ai miei dati personali come da privacy e policy"
								checked={formData.privacy}
								handleChange={handleChange}
							/>
						</div>
					</div>
					<NormalButton
						text="Registrati subito"
						action={() => {
							alert("registrato");
							navigate("/app");
						}}
						disabled={!isFormValid()}
					/>
					<GhostButton
						text="Gi&agrave; registrato? Accedi"
						action={() => {
							navigate("/login");
						}}
					/>
				</form>
			</main>
		</>
	);
}
