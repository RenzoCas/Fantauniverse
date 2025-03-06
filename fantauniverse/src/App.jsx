import { lazy, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";

import Homepage from "./pages/Homepage";
import FAQPage from "./pages/Faq";
import NotFound from "./pages/NotFound";
import FantaUniverse from "./pages/FantaUniverse";
import ProtectedRoute from "./guards/ProtectedRoute";
import Registration from "./pages/Registration";
import ViewLeague from "./pages/ViewLeague";
import Dashboard from "./pages/Dashboard";
import ViewTeam from "./pages/ViewTeam";
import { LeagueProvider } from "./contexts/LeagueContext";
import Rules from "./pages/Rules";

const Login = lazy(() => import("./pages/Login"));

function App() {
	return (
		<UserProvider>
			<LeagueProvider>
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
			</LeagueProvider>
		</UserProvider>
	);
}

function AuthInitializer() {
	const { tokenInfo } = useUser();
	const navigate = useNavigate();
	const hasCheckedToken = useRef(false);

	useEffect(() => {
		const checkToken = async () => {
			if (hasCheckedToken.current) return;
			hasCheckedToken.current = true;

			const token = localStorage.getItem("authToken");
			if (token) {
				try {
					await tokenInfo(token);
					navigate("/app", { replace: true });
				} catch (error) {
					console.error("Sessione scaduta:", error.message);
					localStorage.removeItem("authToken");
				}
			}
		};

		checkToken();
	}, [tokenInfo, navigate]);

	return null;
}

export default App;
