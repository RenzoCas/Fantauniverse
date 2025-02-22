import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import NormalButton from "../atoms/Buttons/NormalButton";
import Logo from "../atoms/Logo";
import GenericInput from "../atoms/Inputs/GenericInput";
import GhostButton from "../atoms/Buttons/GhostButton";

export default function Login() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({ email: "", password: "" });
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
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		let error = "";

		if (!value.trim()) {
			error = "Campo obbligatorio";
		} else if (
			name === "email" &&
			!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
		) {
			error = "Email non valida";
		}

		setErrors({ ...errors, [name]: error });
	};

	const isFormValid = () => {
		return (
			formData.email &&
			formData.password &&
			!errors.email &&
			!errors.password
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isFormValid()) {
			const success = await login(formData.email, formData.password);
			if (success) {
				navigate("/app", { replace: true });
			} else {
				alert("Email o password errate. Riprova.");
			}
		}
	};

	return (
		<>
			<header className="relative h-[46px] border-b-[2px] border-b-(--black-normal)">
				<div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]">
					<Logo />
				</div>
			</header>
			<main className="md:max-w-sm flex flex-col justify-center gap-[16px] mx-auto py-[40px] px-[16px] min-h-dvh">
				<h2 className="title-h2 font-semibold">Login utente</h2>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-[16px]"
				>
					<div className="flex flex-col gap-[10px]">
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
					</div>
					<div className="flex flex-col gap-[8px]">
						<NormalButton
							text="Accedi subito"
							action={handleSubmit}
							disabled={!isFormValid()}
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
