import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();

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

function UserProvider({ children }) {
	const [{ user, isAuthenticated }, dispatch] = useReducer(
		reducer,
		initialState
	);

	const urlServer = "https://soviet-glory-vinzo-s-org-50c662e0.koyeb.app";
	// const urlServer = "http://192.168.1.94:8547";

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

	const logout = async () => {
		try {
			const response = await fetch(`${urlServer}/token/logout`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw {
					status: response.status,
					message:
						"Errore nell'eliminazione del token di autenticazione",
				};
			}
			localStorage.removeItem("authToken");
			dispatch({ type: "logout" });
		} catch (error) {
			console.error("Registration error:", error.message);
			throw error;
		}
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
		<UserContext.Provider
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
		</UserContext.Provider>
	);
}

function useUser() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within an UserProvider");
	}
	return context;
}

export { UserProvider, useUser };
