import Logo from "../atoms/Logo";
import {
	Bars3Icon,
	ChevronRightIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { NavLink } from "react-router";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { logout } = useUser();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<nav className="bg-white py-2 px-4 sticky top-0 flex justify-between items-center border-b-2 border-black relative z-100">
			<Logo />
			<div className="flex gap-3 items-center">
				<button onClick={toggleMenu}>
					<Bars3Icon className="h-[24px] w-[24px]" />
				</button>
			</div>

			<div
				className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-500 p-[16px] flex flex-col gap-[16px] ${
					isMenuOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<button className="self-end" onClick={toggleMenu}>
					<XMarkIcon className="h-6 w-6" />
				</button>
				<NavLink
					to="/profile"
					className="body-small font-bold text-left flex justify-between items-center gap-[4px]"
				>
					Modifica Profilo
					<ChevronRightIcon className="h-[16px] w-[16px] stroke-3" />
				</NavLink>
				<button
					onClick={handleLogout}
					className="body-small font-bold text-left flex justify-between items-center gap-[4px]"
				>
					Logout
				</button>
			</div>
		</nav>
	);
}
