import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { LeagueProvider } from "./contexts/LeagueContext";
import { RuleProvider } from "./contexts/RuleContext";
import { PlayerProvider } from "./contexts/PlayerContext";

import Homepage from "./pages/Homepage";
import FAQPage from "./pages/Faq";
import PrivacyPage from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import FantaUniverse from "./pages/FantaUniverse";
import ProtectedRoute from "./guards/ProtectedRoute";
import Registration from "./pages/Registration";
import ViewLeague from "./pages/ViewLeague";
import Dashboard from "./pages/Dashboard";
import GenericRules from "./pages/GenericRules";
import Login from "./pages/Login";
import Account from "./pages/Account";
import { ParticipantProvider } from "./contexts/ParticipantContext";
import { TeamProvider } from "./contexts/TeamContext";
import { DayProvider } from "./contexts/DayContext";
import GenericPopup from "./components/popups/GenericPopup";
import Loader from "./components/Loader";
import { ModalProvider } from "./contexts/ModalContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GenericRulesNoAuth from "./pages/GenericRulesNoAuth";
import { NotificationProvider } from "./contexts/NotificationContext";
import PrivacyPageNoAuth from "./pages/PrivacyPolicyNoAuth";

function App() {
	return (
		<UserProvider>
			<GoogleOAuthProvider clientId="86863646183-thn42d79m9qsppdfqaihmn8d5drkoill.apps.googleusercontent.com">
				<NotificationProvider>
					<ModalProvider>
						<LeagueProvider>
							<RuleProvider>
								<PlayerProvider>
									<ParticipantProvider>
										<TeamProvider>
											<DayProvider>
												<BrowserRouter>
													<AuthInitializer />
													<Routes>
														<Route
															path="/"
															element={
																<Homepage />
															}
														/>
														<Route
															path="registration"
															element={
																<Registration />
															}
														/>
														<Route
															path="rules"
															element={
																<GenericRulesNoAuth />
															}
														/>
														<Route
															path="privacyPolicy"
															element={
																<PrivacyPageNoAuth />
															}
														/>
														<Route
															path="login"
															element={<Login />}
														/>

														<Route
															path="*"
															element={
																<NotFound />
															}
														/>
														<Route
															path="app"
															element={
																<ProtectedRoute>
																	<FantaUniverse />
																</ProtectedRoute>
															}
														>
															<Route
																index
																element={
																	<Dashboard />
																}
															/>
															<Route
																path="league/:id"
																element={
																	<ViewLeague />
																}
															/>
															<Route
																path="rules"
																element={
																	<GenericRules />
																}
															/>
															<Route
																path="faq"
																element={
																	<FAQPage />
																}
															/>
															<Route
																path="privacyPolicy"
																element={
																	<PrivacyPage />
																}
															/>
															<Route
																path="account"
																element={
																	<Account />
																}
															/>
														</Route>
													</Routes>
												</BrowserRouter>
											</DayProvider>
										</TeamProvider>
									</ParticipantProvider>
								</PlayerProvider>
							</RuleProvider>
						</LeagueProvider>
					</ModalProvider>
				</NotificationProvider>
			</GoogleOAuthProvider>
		</UserProvider>
	);
}

function AuthInitializer() {
	const { tokenInfo } = useUser();
	const navigate = useNavigate();
	const hasCheckedToken = useRef(false);
	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	useEffect(() => {
		const checkToken = async () => {
			if (hasCheckedToken.current) return;
			hasCheckedToken.current = true;

			const token = localStorage.getItem("authToken");
			if (token) {
				try {
					setIsLoading(true);
					await tokenInfo(token);
					setIsLoading(false);
					navigate("/app", { replace: true });
				} catch (error) {
					setIsLoading(false);
					console.error("Sessione scaduta:", error.message);
					showPopup(
						"error",
						"Sessione scaduta!",
						"Rieffettua il login per avviare una nuova sessione."
					);
					localStorage.removeItem("authToken");
				}
			}
		};

		checkToken();
	}, [tokenInfo]);

	return (
		<>
			{isLoading && <Loader />}
			{popupData.isOpen && (
				<GenericPopup
					isOpen={popupData.isOpen}
					type={popupData.type}
					title={popupData.title}
					message={popupData.message}
					classOpt="left-[16px]"
				/>
			)}
		</>
	);
}

export default App;
