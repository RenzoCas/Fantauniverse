import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
	const { isAuthenticated } = useUser();
	const navigate = useNavigate();

	useEffect(
		function () {
			if (!isAuthenticated) navigate("/login");
		},
		[isAuthenticated, navigate]
	);

	return isAuthenticated ? children : null;
}

export default ProtectedRoute;
