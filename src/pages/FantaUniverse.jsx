import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft } from "lucide-react";
import SidebarDesktop from "../components/SidebarDesktop";
import { useModal } from "../contexts/ModalContext";

export default function FantaUniverse() {
	const navigate = useNavigate();
	const location = useLocation();
	const isLeaguePage = location.pathname.startsWith("/app/league/");
	const { isOpen } = useModal();

	return (
		<>
			<Navbar />
			<div
				id={`ModalBackdrop`}
				tabIndex="-1"
				aria-hidden={!isOpen}
				className={`fixed bottom-0 left-0 w-screen h-screen px-[16px] bg-(--black-normal)/50 transition-all duration-300 ease z-1000 ${
					isOpen
						? "opacity-100 visible"
						: "opacity-0 invisible delay-150"
				}`}
			></div>
			{isLeaguePage && (
				<button
					className="flex items-center gap-[10px] justify-center w-full p-[10px] bg-(--black-light) body-normal lg:hidden"
					onClick={() => navigate("/app")}
				>
					<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
					Torna alla dashboard
				</button>
			)}

			<main className="flex max-w-xl mx-auto py-[24px] px-[16px] bg-white lg:bg-(--black-light) lg:max-w-full lg:py-[8px] lg:px-0 lg:max-h-screen lg:h-screen">
				<SidebarDesktop />
				<section className="w-full lg:bg-white lg:rounded-l-[24px] lg:pb-[20px] lg:pt-[88px] lg:flex lg:flex-col">
					<div className="w-full lg:max-w-[840px] lg:max-h-full lg:mx-auto lg:py-[55px] lg:px-[24px] lg:overflow-x-auto relative">
						<Outlet />
					</div>
				</section>
			</main>
		</>
	);
}
