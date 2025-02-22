import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Homepage from "./pages/Homepage";
import Regolamento from "./pages/Regolamento";
import FAQPage from "./pages/Faq";
import NotFound from "./pages/NotFound";
import FantaUniverse from "./pages/FantaUniverse";
import ProtectedRoute from "./guards/ProtectedRoute";
import Registrazione from "./pages/Registrazione";

const Login = lazy(() => import("./pages/Login"));

function App() {
	return (
		<>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Homepage />} />
						<Route path="registrazione" element={<Registrazione />} />
						<Route path="login" element={<Login />} />
						<Route path="regolamento" element={<Regolamento />} />
						<Route path="faq" element={<FAQPage />} />
						<Route path="*" element={<NotFound />} />
						<Route
							path="app"
							element={
								<ProtectedRoute>
									<FantaUniverse />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</>
	);
}

export default App;
