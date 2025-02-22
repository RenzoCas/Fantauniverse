import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
	user: null,
	isAuthenticated: false,
};

const FAKE_USER = {
	name: "Renzo",
	email: "admin@gmail.com",
	password: "admin",
};

function reducer(state, action) {
	switch (action.type) {
		case "login":
			return { ...state, user: action.payload, isAuthenticated: true };

		case "logout":
			return { ...state, user: null, isAuthenticated: false };

		default:
			return state; // This case is important to avoid undefined state
	}
}

function AuthProvider({ children }) {
	const [{ user, isAuthenticated }, dispatch] = useReducer(
		reducer,
		initialState
	);

	function login(email, password) {
		if (email === FAKE_USER.email && password === FAKE_USER.password) {
			dispatch({ type: "login", payload: FAKE_USER });
			return true; // Return true for successful login
		}
		return false; // Return false for failed login
	}

	function logout() {
		dispatch({ type: "logout" });
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export { AuthProvider, useAuth };
