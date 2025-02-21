import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import NormalButton from "../atoms/Buttons/NormalButton";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [isValid, setIsValid] = useState(true);

	useEffect(
		function () {
			if (isAuthenticated === true) navigate("/app", { replace: true });
		},

		[isAuthenticated, navigate]
	);

	function handleSubmit(e) {
		e.preventDefault();
		if (email && password) login(email, password);
	}

	function validateEmail(email) {
		setEmail(email);
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setIsValid(emailRegex.test(email));
	}

	return (
		<main className="max-w-3xl mx-auto py-8 px-4 lg:py-16 lg:px-6 flex flex-col gap-4 justify-center min-h-[calc(100dvh-64px)]">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label
						htmlFor="email"
						className="body-small font-bold text-(--primary)"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						className={`bg-white body-small rounded-lg focus:outline-none block w-full p-2 border-2 ${
							!isValid && "border-red-500"
						}`}
						placeholder="mariorossi@gmail.com"
						required
						onChange={(e) => validateEmail(e.target.value)}
						value={email}
					/>
					<p
						className={`text-red-500 body-small ${
							isValid ? "hidden" : "block"
						}`}
					>
						Email non valida
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<label
						htmlFor="password"
						className="body-small font-bold text-(--primary)"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						className="bg-white body-small rounded-lg focus:outline-none block w-full p-2 border-2"
						placeholder="password"
						required
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
				</div>
				<NormalButton>Login</NormalButton>
			</form>
			<p className="flex gap-1 self-center text-(--white) mt-auto">
				Non hai un account?
			</p>
		</main>
	);
}
