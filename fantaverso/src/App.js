import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import Homepage from "./pages/Homepage/Homepages";
import ProtectedRoute from "./guards/ProtectedRoute";
import Regolamento from "./pages/Regolamento/Regolamento";

const Login = lazy(() => import("./pages/Login/Login"));

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="regolamento" element={<Regolamento />} />
					<Route path="login" element={<Login />} />
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
	);
}

export default App;
