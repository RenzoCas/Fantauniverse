import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft } from "lucide-react";
import SidebarDesktop from "../components/SidebarDesktop";

export default function FantaUniverse() {
	const navigate = useNavigate();
	const location = useLocation();
	const isLeaguePage = location.pathname.startsWith("/app/league/");

	return (
		<>
			<Navbar />
			{isLeaguePage && (
				<button
					className="flex items-center gap-[10px] justify-center w-full p-[10px] bg-(--black-light) body-normal lg:hidden"
					onClick={() => navigate("/app")}
				>
					<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
					Torna alla dashboard
				</button>
			)}

			<main className="flex max-w-xl mx-auto py-[24px] px-[16px] min-h-[calc(100dvh-64px)] bg-white lg:bg-(--black-light) lg:max-w-full lg:py-[8px] lg:px-0 lg:max-h-screen lg:h-screen">
				<SidebarDesktop />
				<section className="w-full lg:bg-white lg:rounded-l-[24px] lg:pb-[20px] lg:pt-[88px] lg:flex lg:flex-col">
					<div className="w-full lg:max-w-[840px] lg:max-h-full lg:mx-auto lg:py-[55px] lg:px-[24px] lg:overflow-x-auto">
						<Outlet />
					</div>
				</section>
			</main>
			{/* <main className="flex flex-col max-w-xl mx-auto py-[24px] px-[16px] lg:py-16 lg:px-6 min-h-[calc(100dvh-64px)]">
				<Outlet />
			</main> */}
		</>
	);
}
