import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../contexts/UserContext";
import GhostButton from "../atoms/Buttons/GhostButton";
import NormalButton from "../atoms/Buttons/NormalButton";
import GenericInput from "../atoms/Inputs/GenericInput";
import Logo from "../atoms/Logo";
// import Checkbox from "../atoms/Inputs/Checkbox";
import Loader from "../components/Loader";
import { GoogleLogin } from "@react-oauth/google";

export default function Registrazione() {
	const messageError = "Campo obbligatorio";
	const navigate = useNavigate();
	const { register, googleLogin } = useUser();

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
			await register({
				username: formData.username,
				email: formData.email,
				password: formData.password,
				// privacy: formData.privacy,
			});
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

	// const handleGoogleLogin = useGoogleLogin({
	// 	onSuccess: (tokenResponse) => googleLogin(tokenResponse),
	// });

	return (
		<>
			{isLoading && <Loader />}
			<header className="relative h-[46px] border-b-[2px] border-b-(--black-normal) lg:hidden">
				<div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]">
					<Logo />
				</div>
			</header>

			<main className="flex lg:grid lg:grid-cols-2 mx-auto py-[40px] px-[16px] min-h-[calc(100dvh-46px)]">
				<div className="absolute top-[100px] left-0 h-[16px] w-screen bg-(--black-darker) hidden lg:block"></div>
				<div className="absolute top-[120px] left-0 h-[16px] w-screen bg-(--black-darker) hidden lg:block"></div>
				<section className="flex flex-col justify-center gap-[32px] max-w-[360px] mx-auto">
					<h2 className="title-h2 font-semibold bg-white z-1 lg:px-[16px]">
						Registrazione utente
					</h2>
					<form
						className="flex flex-col gap-[32px]"
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
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
								icon={false}
							/>

							<GhostButton
								text="Gi&agrave; registrato? Accedi"
								action={() => navigate("/login")}
								icon={false}
							/>
							<div className="h-[1px] w-[243px] bg-(--black-light) mx-auto"></div>
							{/* <GhostButton
								text="Oppure accedi con google."
								action={() => handleGoogleLogin()}
								icon={false}
							/> */}
							<div className="flex justify-center">
								<GoogleLogin
									onSuccess={(credentialResponse) => {
										googleLogin(credentialResponse);
									}}
									theme="filled_blue"
									shape="circle"
									width="300"
								/>
							</div>
						</div>
					</form>
				</section>
				<section className="relative hidden lg:block max-w-[708px] bg-[url('/images/bgHome.jpg')] bg-centre bg-no-repeat bg-cover rounded-[24px]">
					<div className="flex flex-col gap-[8px] px-[32px] md:px-0 absolute bottom-[30px] left-[30px]">
						<div
							className={`relative rounded-full h-[46px] w-[46px] bg-white`}
						>
							<span
								className={`absolute rounded-full h-[8px] w-[8px] top-1/2 transform -translate-y-1/2 right-[4px] bg-(--black-normal)`}
							></span>
						</div>
						<h1 className="title-h2 font-bold text-white">
							All.
							<br />
							The league.
							<br />
							That u want.
						</h1>
					</div>
				</section>
			</main>
		</>
	);
}
