import { useState } from "react";
import { useNavigate } from "react-router";
import GhostButton from "../atoms/Buttons/GhostButton";
import NormalButton from "../atoms/Buttons/NormalButton";
import GenericInput from "../atoms/Inputs/GenericInput";
import Logo from "../atoms/Logo";
// import Checkbox from "../atoms/Inputs/Checkbox";
import { useUser } from "../contexts/UserContext";
import Loader from "../components/Loader";

export default function Registrazione() {
	const messageError = "Campo obbligatorio";
	const navigate = useNavigate();
	const { register } = useUser();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confermaPassword: "",
		privacy: false,
	});

	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const validatePassword = (password) =>
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(
			password
		);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
		setServerError("");
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
			formData.username &&
			validateEmail(formData.email) &&
			validatePassword(formData.password) &&
			formData.password === formData.confermaPassword
			// formData.privacy
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isFormValid()) return;

		setIsLoading(true);
		setServerError("");

		try {
			const user = await register({
				username: formData.username,
				email: formData.email,
				password: formData.password,
				// privacy: formData.privacy,
			});

			localStorage.setItem("token", user.token);
			navigate("/app");
		} catch (error) {
			if (error.status == 409) {
				setServerError("Username o email già esistenti");
			} else {
				setServerError("Errore nella registrazione, riprova.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{isLoading && <Loader />}
			<header className="relative h-[46px] border-b-[2px] border-b-(--black-normal)">
				<div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]">
					<Logo />
				</div>
			</header>

			<main className="md:max-w-sm flex flex-col justify-center gap-[32px] mx-auto py-[40px] px-[16px] min-h-[calc(100dvh-46px)]">
				<h2 className="title-h2 font-semibold">Registrazione utente</h2>
				<form
					className="flex flex-col gap-[32px]"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col gap-[10px]">
						{serverError && (
							<p className="text-(--error-normal)">
								{serverError}
							</p>
						)}
						<GenericInput
							type="text"
							required
							name="username"
							id="usernameUtente"
							placeholder="Username"
							messageError={errors.username}
							value={formData.username}
							handleChange={handleChange}
							handleBlur={handleBlur}
							autocomplete="username"
						/>
						<GenericInput
							type="email"
							required
							name="email"
							id="emailUtente"
							placeholder="Email"
							messageError={errors.email}
							value={formData.email}
							handleChange={handleChange}
							handleBlur={handleBlur}
							autocomplete="email"
						/>
						<GenericInput
							type="password"
							required
							name="password"
							id="passwordUtente"
							placeholder="Password"
							messageError={errors.password}
							value={formData.password}
							handleChange={handleChange}
							handleBlur={handleBlur}
							autocomplete="new-password"
						/>
						<GenericInput
							type="password"
							required
							name="confermaPassword"
							id="confermaPasswordUtente"
							placeholder="Conferma Password"
							messageError={errors.confermaPassword}
							value={formData.confermaPassword}
							handleChange={handleChange}
							handleBlur={handleBlur}
							autocomplete="new-password"
						/>
						{/* <div className="flex align-start gap-[10px]">
							<Checkbox
								name="privacy"
								id="privacyPolicy"
								required
								messageError={messageError}
								label="Acconsento al trattamento ai miei dati personali come da privacy e policy"
								checked={formData.privacy}
								handleChange={handleChange}
							/>
						</div> */}
					</div>
					<div className="flex flex-col gap-[8px]">
						<NormalButton
							text={
								isLoading
									? "Registrazione in corso..."
									: "Registrati subito"
							}
							action={handleSubmit}
							disabled={!isFormValid() || isLoading}
						/>

						<GhostButton
							text="Gi&agrave; registrato? Accedi"
							action={() => navigate("/login")}
						/>
					</div>
				</form>
			</main>
		</>
	);
}
