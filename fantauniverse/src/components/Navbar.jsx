import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function Navbar() {
	const location = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav
			className={`bg-(--primary) text-white p-4 shadow-md sticky top-0 ${
				location.pathname === "/" && "hidden"
			}`}
		>
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<NavLink to="/" className="title-h5 font-thin cl-black">
					Fanta<span className="cl-black font-bold">UNIVERSE</span>
				</NavLink>

				<button
					className="block lg:hidden text-3xl text-black"
					onClick={toggleMenu}
				>
					{isMenuOpen ? (
						<XMarkIcon className="w-8 h-8 text-black" />
					) : (
						<Bars3Icon className="w-8 h-8 text-black" />
					)}
				</button>

				<ul className="hidden lg:flex gap-4">
					<li>
						<NavLink
							to="/regolamento"
							className="body-regular pb-1 text-(--black) font-bold"
						>
							Regolamento
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/faq"
							className="body-regular pb-1 text-(--black) font-bold"
						>
							FAQ
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/login"
							className="body-regular pb-1 text-(--black) font-bold"
						>
							Gioca
						</NavLink>
					</li>
				</ul>

				<div
					className={`${
						isMenuOpen ? "translate-x-0" : "translate-x-full"
					} fixed inset-0 top-[64px] bg-(--background) z-50 md:hidden transition-transform duration-800 ease flex flex-col gap-4 px-4 py-6`}
					onClick={toggleMenu}
				>
					<NavLink
						to="/regolamento"
						className="body-large text-(--primary) font-bold border-b border-b-(--primary) pb-2"
						onClick={toggleMenu}
					>
						Regolamento
					</NavLink>
					<NavLink
						to="/faq"
						className="body-large text-(--primary) font-bold border-b border-b-(--primary) pb-2"
						onClick={toggleMenu}
					>
						FAQ
					</NavLink>
					<NavLink
						to="/login"
						className="body-large text-(--primary) font-bold border-b border-b-(--primary) pb-2"
						onClick={toggleMenu}
					>
						Gioca
					</NavLink>
				</div>
			</div>
		</nav>
	);
}
