import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function FormLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isAuthenticated } = useAuth();

	function handleSubmit(e) {
		e.preventDefault();
		if (email && password) login(email, password);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="email">Email address</label>
				<input
					type="email"
					id="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
				/>
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
				/>
			</div>
			<button type="submit">Registrati</button>
		</form>
	);
}

export default FormLogin;
