import Logo from "../atoms/Logo";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	EqualsIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { logout } = useUser();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav
			className={`bg-white py-[8px] px-[16px] sticky top-0 flex justify-between items-center border-b-[2px] border-b-(--black-normal)`}
		>
			<Logo />
			<div className="flex gap-[12px] items-center">
				<button onClick={logout}>
					<EqualsIcon className="h-[24px] w-[24px]" />
				</button>
				<button
					onClick={toggleMenu}
					className="p-[4px] bg-(--black-light) flex gap-[4px] items-center rounded-[2px]"
				>
					<UserCircleIcon className="h-[27px] w-[27px]" />
					{!isMenuOpen ? (
						<ChevronDownIcon className="h-[20px] w-[20px]" />
					) : (
						<ChevronUpIcon className="h-[20px] w-[20px]" />
					)}
				</button>
			</div>
		</nav>
	);
}
