import { lazy } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import Homepage from "./pages/Homepage/Homepages";
import ProtectedRoute from "./guards/ProtectedRoute";
import Regolamento from "./pages/Regolamento/Regolamento";
import Faq from "./pages/Faq/Faq";
import NotFound from "./pages/NotFound/NotFound";
import Navbar from "./components/Navbar";

const Login = lazy(() => import("./pages/Login/Login"));

function App() {
	return (
		<>
			<AuthProvider>
				<BrowserRouter>
					<Navbar />
					<Routes>
						<Route path="/" element={<Homepage />} />
						<Route path="login" element={<Login />} />
						<Route path="regolamento" element={<Regolamento />} />
						<Route path="faq" element={<Faq />} />
						<Route path="*" element={<NotFound />} />
						<Route
							path="app"
							element={
								<ProtectedRoute>
									<App />
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
