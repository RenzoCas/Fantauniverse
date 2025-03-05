import { lazy, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import { lazy } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";

import Homepage from "./pages/Homepage";
import FAQPage from "./pages/Faq";
import NotFound from "./pages/NotFound";
import FantaUniverse from "./pages/FantaUniverse";
import ProtectedRoute from "./guards/ProtectedRoute";
import Registration from "./pages/Registration";
import ViewLeague from "./pages/ViewLeague";
import Dashboard from "./pages/Dashboard";
import ViewTeam from "./pages/ViewTeam";
import Rules from "./components/Rules";

const Login = lazy(() => import("./pages/Login"));

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<AuthInitializer />
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="registration" element={<Registration />} />
					<Route path="login" element={<Login />} />
					<Route path="rules" element={<Rules />} />
					<Route path="faq" element={<FAQPage />} />
					<Route path="*" element={<NotFound />} />

					<Route
						path="app"
						element={
							<ProtectedRoute>
								<FantaUniverse />
							</ProtectedRoute>
						}
					>
						<Route index element={<Dashboard />} />
						<Route path="league/:id" element={<ViewLeague />} />
						<Route path="league/team" element={<ViewTeam />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

function AuthInitializer() {
	const { tokenInfo } = useAuth();
	const navigate = useNavigate();
	const hasCheckedToken = useRef(false);

	useEffect(() => {
		const checkToken = async () => {
			if (hasCheckedToken.current) return;
			hasCheckedToken.current = true;

			const token = localStorage.getItem("token");
			if (token) {
				try {
					await tokenInfo(token);
					navigate("/app", { replace: true });
				} catch (error) {
					console.error("Sessione scaduta:", error.message);
				}
			}
		};

		checkToken();
	}, [tokenInfo, navigate]);

	return null;
}

export default App;
