import { NavLink, useLocation } from "react-router";
import styles from "./Navbar.module.css";

export default function Navbar() {
	const location = useLocation();

	if (location.pathname === "/") {
		return null;
	}

	return (
		<nav className="bg-(--primary) text-white p-4 shadow-md sticky top-0">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<NavLink to="/" className="title-h5 font-thin cl-black">
					Fanta
					<span className="cl-black font-bold">UNIVERSE</span>
				</NavLink>
				<ul className="m-0 flex gap-4">
					<li>
						<NavLink
							to="/regolamento"
							className={({ isActive }) =>
								`${isActive && styles.active} ${
									styles.btnNavbar
								} body-regular pb-1 text-(--black) font-bold`
							}
						>
							Regolamento
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/faq"
							className={({ isActive }) =>
								`${isActive && styles.active} ${
									styles.btnNavbar
								} body-regular pb-1 text-(--black) font-bold`
							}
						>
							FAQ
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/login"
							className={({ isActive }) =>
								`${isActive && styles.active} ${
									styles.btnNavbar
								} body-regular pb-1 text-(--black) font-bold`
							}
						>
							Gioca
						</NavLink>
					</li>
				</ul>
			</div>
		</nav>
	);
}
