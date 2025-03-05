import { createContext, useContext, useReducer } from "react";

const LegheContext = createContext();

const initialState = {
	id: "",
	name: "",
	visibility: "",
	partecipants: [],
};

function reducer(state, action) {
	switch (action.type) {
		case "recupera":
		case "login":
		case "tokenInfo":
			return { ...state, user: action.payload, isAuthenticated: true };

		case "logout":
			return { ...state, user: null, isAuthenticated: false };

		default:
			return state;
	}
}

function LegheProvider({ children }) {
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
		<LegheContext.Provider
			value={{
				user,
				isAuthenticated,
				login,
				register,
				logout,
				tokenInfo,
			}}
		>
			{children}
		</LegheContext.Provider>
	);
}

function useLeghe() {
	const context = useContext(LegheContext);
	if (!context) {
		throw new Error("useLeghe must be used within an LegheProvider");
	}
	return context;
}

export { LegheProvider, useLeghe };
