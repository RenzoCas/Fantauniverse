import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft } from "lucide-react";

export default function FantaUniverse() {
	const navigate = useNavigate();
	const location = useLocation();
	const isLeaguePage = location.pathname.startsWith("/app/league/");

	return (
		<>
			<Navbar />

			{isLeaguePage && (
				<button
					className="flex items-center gap-[10px] justify-center w-full p-[10px] bg-(--black-light) body-normal"
					onClick={() => navigate("/app")}
				>
					<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
					Torna alla dashboard
				</button>
			)}

			<main className="flex flex-col max-w-xl mx-auto py-[24px] px-[16px] lg:py-16 lg:px-6 min-h-[calc(100dvh-64px)]">
				<Outlet />
			</main>
		</>
	);
}
