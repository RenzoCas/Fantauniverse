import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function FantaUniverse() {
	return (
		<>
			<header>
				<Navbar />
			</header>
			<main className="max-w-xl mx-auto py-[24px] px-[16px] lg:py-16 lg:px-6 min-h-[calc(100dvh-64px)]">
				<Outlet />
			</main>
		</>
	);
}
