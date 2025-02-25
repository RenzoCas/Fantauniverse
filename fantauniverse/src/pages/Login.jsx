import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import NormalButton from "../atoms/Buttons/NormalButton";
import Logo from "../atoms/Logo";
import GenericInput from "../atoms/Inputs/GenericInput";
import GhostButton from "../atoms/Buttons/GhostButton";
import Loader from "../components/Loader";

export default function Login() {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login, isAuthenticated } = useAuth();
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

	const handleBlur = (e) => {
		const { name, value } = e.target;
		let error = value.trim() ? "" : "Campo obbligatorio";
		setErrors({ ...errors, [name]: error });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		setServerError("");

		try {
			const user = await login(formData.username, formData.password);
			localStorage.setItem("token", user.token);
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
			<header className="relative h-[46px] border-b-[2px] border-b-black">
				<div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]">
					<Logo />
				</div>
			</header>

			<main className="md:max-w-sm flex flex-col justify-center gap-[16px] mx-auto py-[40px] px-[16px] min-h-[calc(100dvh-46px)]">
				<h2 className="title-h2 font-semibold">Login utente</h2>
				<form
					onSubmit={handleSubmit}
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
							placeholder="Username"
							messageError={errors.username}
							value={formData.username}
							handleChange={handleChange}
							handleBlur={handleBlur}
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
						/>
						<GhostButton
							text="Non sei registrato? Registrati"
							action={() => navigate("/registrazione")}
						/>
					</div>
				</form>
			</main>
		</>
	);
}
