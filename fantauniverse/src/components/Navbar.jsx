import {
	Bars3Icon,
	ChevronRightIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { NavLink, useNavigate } from "react-router";
import Logo from "../atoms/Logo";
import NormalButton from "../atoms/Buttons/NormalButton";

export default function Navbar() {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { logout } = useUser();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	return (
		<nav className="bg-white py-[8px] px-[16px] sticky top-0 flex justify-between items-center border-b-[2px] border-black relative z-100">
			<Logo />
			<div className="flex gap-3 items-center">
				<button onClick={toggleMenu}>
					<Bars3Icon className="h-[24px] w-[24px]" />
				</button>
			</div>

			<div
				className={`fixed top-0 right-0 h-full w-full bg-(--black-normal)/50 ${
					isMenuOpen ? "flex" : "hidden"
				}`}
			></div>

			<div
				className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-500 p-[16px] flex flex-col gap-[16px] ${
					isMenuOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<button className="self-end" onClick={toggleMenu}>
					<XMarkIcon className="h-[24px] w-[24px]" />
				</button>
				<NavLink
					to="/app"
					className="body-normal font-semibold text-left flex justify-between items-center gap-[4px] mt-[16px]"
				>
					Le mie leghe
					<ChevronRightIcon className="h-[16px] w-[16px] stroke-2" />
				</NavLink>
				<NavLink
					to="/rules"
					className="body-normal font-semibold text-left flex justify-between items-center gap-[4px]"
				>
					Regolamento
					<ChevronRightIcon className="h-[16px] w-[16px] stroke-2" />
				</NavLink>
				<NavLink
					to="/account"
					className="body-normal font-semibold text-left flex justify-between items-center gap-[4px]"
				>
					Modifica Profilo
					<ChevronRightIcon className="h-[16px] w-[16px] stroke-2" />
				</NavLink>
				<NormalButton
					text="Logout"
					action={handleLogout}
					classOpt={`mt-auto`}
				/>
			</div>
		</nav>
	);
}
