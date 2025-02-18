import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(
		function () {
			if (isAuthenticated === true) navigate("/home", { replace: true });
		},

		[isAuthenticated, navigate]
	);

	function handleSubmit(e) {
		e.preventDefault();
		if (email && password) login(email, password);
	}

	return (
		<main className={styles.login}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.row}>
					<label htmlFor="email">Email address</label>
					<input
						type="email"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>

				<div className={styles.row}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
				</div>
			</form>
		</main>
	);
}
