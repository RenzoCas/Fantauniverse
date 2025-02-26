import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
	user: null,
	isAuthenticated: false,
};

function reducer(state, action) {
	switch (action.type) {
		case "register":
		case "login":
		case "tokenInfo":
			return { ...state, user: action.payload, isAuthenticated: true };

		case "logout":
			return { ...state, user: null, isAuthenticated: false };

		default:
			return state;
	}
}

function AuthProvider({ children }) {
	const [{ user, isAuthenticated }, dispatch] = useReducer(
		reducer,
		initialState
	);

	const urlServer = "http://192.168.1.94:8547";

	const login = async (username, password) => {
		try {
			const response = await fetch(`${urlServer}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Errore nella login");
			}

			const user = await response.json();
			dispatch({ type: "login", payload: user });

			return user;
		} catch (error) {
			console.error("Login error:", error.message);
			throw error;
		}
	};

	const register = async (formData) => {
		try {
			const response = await fetch(`${urlServer}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw {
					status: response.status,
					message: "Errore nella registrazione",
				};
			}

			const user = await response.json();
			dispatch({ type: "register", payload: user });

			return user;
		} catch (error) {
			console.error("Registration error:", error.message);
			throw error;
		}
	};

	const logout = () => {
		dispatch({ type: "logout" });
	};

	const tokenInfo = async (token) => {
		try {
			const response = await fetch(`${urlServer}/token/info`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw {
					status: response.status,
					message: "Sessione scaduta",
				};
			}

			const user = await response.json();
			dispatch({ type: "tokenInfo", payload: user });

			return user;
		} catch (error) {
			console.error("Sessione scaduta:", error.message);
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				urlServer,
				login,
				register,
				logout,
				tokenInfo,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export { AuthProvider, useAuth };
