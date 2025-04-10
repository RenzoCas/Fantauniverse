import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import NormalButton from "../atoms/Buttons/NormalButton";
import Logo from "../atoms/Logo";
import GenericInput from "../atoms/Inputs/GenericInput";
import GhostButton from "../atoms/Buttons/GhostButton";
import Loader from "../components/Loader";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login, isAuthenticated, googleLogin } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/app", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setServerError("");
	};

	const isFormValid = () => {
		return (
			formData.username.trim() !== "" && formData.password.trim() !== ""
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
		if (!isFormValid()) return;

		setIsLoading(true);
		setServerError("");

		try {
			await login(formData.username, formData.password);
			navigate("/app", { replace: true });
		} catch (error) {
			setServerError("Username o password errati");
			console.log(error.message);
		} finally {
			setIsLoading(false);
		}
	};

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
						Login utente
					</h2>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
						className="flex flex-col gap-[16px]"
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
								id="username"
								placeholder="Username o email"
								messageError={errors.username}
								value={formData.username}
								handleChange={handleChange}
								handleBlur={handleBlur}
								autocomplete="username"
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
								autocomplete="current-password"
							/>
						</div>

						<div className="flex flex-col gap-[8px]">
							<NormalButton
								text={
									isLoading
										? "Accesso in corso..."
										: "Accedi subito"
								}
								action={handleSubmit}
								disabled={!isFormValid()}
								icon={false}
							/>
							<GhostButton
								text="Non sei registrato? Registrati"
								action={() => navigate("/registration")}
								icon={false}
							/>
							<div className="h-[1px] w-[243px] bg-(--black-light) mx-auto"></div>
							{/* <GhostButton
								text="Oppure accedi con google."
								action={() => handleGoogleLogin()}
								icon={false}
							/> */}
							<GoogleLogin
								onSuccess={(credentialResponse) => {
									googleLogin(credentialResponse);
								}}
								theme="filled_blue"
								shape="circle"
								width={"100%"}
							/>
						</div>
					</form>
				</section>
				<section className="relative hidden lg:block max-w-[708px] bg-[url(https://main.djli7xgqeongu.amplifyapp.com/bgHome.jpg)] bg-centre bg-no-repeat bg-cover rounded-[24px]">
					<div className="flex flex-col gap-[8px] px-[32px] md:px-0 absolute bottom-[30px] left-[30px]">
						<Logo white={true}></Logo>
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
