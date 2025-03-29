import {
	ArrowUpTrayIcon,
	Bars3Icon,
	ChatBubbleOvalLeftEllipsisIcon,
	ChevronRightIcon,
	Cog6ToothIcon,
	ExclamationCircleIcon,
	HomeIcon,
	// MagnifyingGlassIcon,
	// PlusIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import Logo from "../atoms/Logo";
import { useLeague } from "../contexts/LeagueContext";

export default function Navbar() {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, logout, unregister } = useUser();
	const { icon, username } = user;
	const { myLeagues } = useLeague();
	const [randomColors, setRandomColors] = useState([]);
	const [visibleCount, setVisibleCount] = useState(3);
	const [leagues, setLeagues] = useState();

	useEffect(() => {
		setLeagues(myLeagues);
	}, [myLeagues]);

	useEffect(() => {
		const numColors = leagues?.length + 1;

		const colors = Array.from({ length: numColors }, () =>
			randomLightColor()
		);
		setRandomColors(colors);
	}, [leagues]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		setVisibleCount(3);
	};

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	const handleUnregister = async () => {
		const res = await unregister();
		if (!res) {
			alert("viao");
		} else {
			navigate("/");
		}
	};

	const loadMore = () => {
		setVisibleCount((prevCount) => prevCount + 5);
	};

	const randomLightColor = () => {
		const getRandomValue = () => Math.floor(Math.random() * 128) + 128;
		const r = getRandomValue();
		const g = getRandomValue();
		const b = getRandomValue();
		return `#${r.toString(16).padStart(2, "0")}${g
			.toString(16)
			.padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};

	const handleClickLeague = (league) => {
		setIsMenuOpen(false);
		setVisibleCount(3);
		navigate(`league/${league.id}`, {
			state: { league, deleteLeague: null },
			replace: true,
		});
	};

	const handleClickLink = (path) => {
		if (window.location.pathname === path) {
			setIsMenuOpen(false);
			return;
		}
		setIsMenuOpen(false);
		navigate(path);
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
				onClick={toggleMenu}
			></div>
			<div
				className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-500 px-[16px] py-[35px] flex flex-col gap-[10px] flex-1 ${
					isMenuOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between gap-[8px]">
					<div className="flex gap-[20px] items-center">
						<picture className="rounded-lg min-w-[50px] max-w-[50px] h-[50px] overflow-hidden">
							{icon == null ? (
								<div
									className={`h-full object-cover`}
									style={{
										backgroundColor: randomColors[0],
									}}
								></div>
							) : (
								<img
									src={`data:image/png;base64,${icon}`}
									alt={`Icona utente`}
									className="h-full object-cover"
								/>
							)}
						</picture>
						<h3 className="body-regular">
							Bentornato, <br />
							<span className="font-semibold">{username}</span>
						</h3>
					</div>
					<button
						onClick={toggleMenu}
						className="p-[8px] rounded-[4px] border border-solid border-(--black-light)"
					>
						<XMarkIcon className="h-[24px] w-[24px] stroke-2" />
					</button>
				</div>
				<div className="h-[16px] w-full border-t border-t-solid border-t-(--black-light-active)"></div>
				<div className="flex flex-col gap-[10px] flex-1 overflow-y-auto">
					<div className="flex flex-col gap-[10px]">
						<h2 className="body-regular text-[#B0B0B0] font-semibold">
							Le tue leghe
						</h2>
						{leagues?.length > 0 ? (
							<>
								<ul className="flex flex-col gap-[10px]">
									{leagues
										.slice(0, visibleCount)
										.map((league, idx) => (
											<li
												key={league.id}
												className="flex items-center gap-[20px]"
												onClick={() =>
													handleClickLeague(league)
												}
											>
												<picture className="rounded-lg min-w-[50px] max-w-[50px] h-[50px] overflow-hidden">
													{league.icon == null ? (
														<div
															className={`h-full object-cover`}
															style={{
																backgroundColor:
																	randomColors[
																		idx
																	],
															}}
														></div>
													) : (
														<img
															src={`data:image/png;base64,${league.icon}`}
															alt={`Icona utente`}
															className="h-full object-cover"
														/>
													)}
												</picture>
												<h4 className="body-normal font-medium">
													{league.name}
												</h4>
												<ChevronRightIcon className="h-[20px] min-w-[20px] max-w-[20px] ml-auto stroke-2" />
											</li>
										))}
								</ul>
								{visibleCount < leagues.length && (
									<button onClick={loadMore}>
										Carica di più
									</button>
								)}
							</>
						) : (
							<>
								<p className="body-normal font-medium text-(--black-normal)">
									Sembra che tu non abbia ancora una lega.
									Cerca una nuova lega oppure creane una da
									zero.
								</p>
								<ul className="flex flex-col gap-[10px]">
									<li>
										<button
											className="flex items-center gap-[20px] text-(--black-normal) font-medium body-normal w-full text-left"
											onClick={() =>
												handleClickLink("/app")
											}
										>
											<HomeIcon className="h-[20px] min-w-[20px] max-w-[20px] stroke-2" />
											<span className="body-normal font-semibold text-(--black-normal)">
												Vai alla Dashboard
											</span>
											<ChevronRightIcon className="h-[20px] min-w-[20px] max-w-[20px] ml-auto stroke-2" />
										</button>
									</li>
								</ul>
							</>
						)}
					</div>
					<div className="h-[16px] w-full border-t border-t-solid border-t-(--black-light-active)"></div>
					<div className="flex flex-col gap-[10px]">
						<h2 className="body-regular text-[#B0B0B0] font-semibold">
							Links
						</h2>
						<ul className="flex flex-col gap-[10px]">
							{leagues?.length > 0 && (
								<li>
									<button
										className="flex items-center gap-[20px] text-(--black-normal) font-medium body-normal w-full text-left"
										onClick={() => handleClickLink("/app")}
									>
										<HomeIcon className="h-[20px] min-w-[20px] max-w-[20px] stroke-2" />
										<span className="body-normal font-semibold text-(--black-normal)">
											Vai alla Dashboard
										</span>
										<ChevronRightIcon className="h-[20px] min-w-[20px] max-w-[20px] ml-auto stroke-2" />
									</button>
								</li>
							)}
							<li>
								<button
									className="flex items-center gap-[20px] text-(--black-normal) font-medium body-normal w-full text-left"
									onClick={() => handleClickLink("/rules")}
								>
									<ExclamationCircleIcon className="h-[20px] min-w-[20px] max-w-[20px] stroke-2" />
									<span className="body-normal font-semibold text-(--black-normal)">
										Come funziona?
									</span>
									<ChevronRightIcon className="h-[20px] min-w-[20px] max-w-[20px] ml-auto stroke-2" />
								</button>
							</li>
							<li>
								<button
									className="flex items-center gap-[20px] text-(--black-normal) font-medium body-normal w-full text-left"
									onClick={() => handleClickLink("/account")}
								>
									<Cog6ToothIcon className="h-[20px] min-w-[20px] max-w-[20px] stroke-2" />
									<span className="body-normal font-semibold text-(--black-normal)">
										Modifica il tuo profilo
									</span>
									<ChevronRightIcon className="h-[20px] min-w-[20px] max-w-[20px] ml-auto stroke-2" />
								</button>
							</li>
							<li>
								<button
									className="flex items-center gap-[20px] text-(--black-normal) font-medium body-normal w-full text-left"
									onClick={() => handleClickLink("/faq")}
								>
									<ChatBubbleOvalLeftEllipsisIcon className="h-[20px] min-w-[20px] max-w-[20px] stroke-2" />
									<span className="body-normal font-semibold text-(--black-normal)">
										Hai bisogno di aiuto? Controlla le
										nostre FAQ
									</span>
									<ChevronRightIcon className="h-[20px] min-w-[20px] max-w-[20px] ml-auto stroke-2" />
								</button>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex flex-col gap-[10px] sticky bottom-0 bg-white">
					<div className="h-[16px] w-full border-t border-t-solid border-t-(--black-light-active)"></div>
					<ul className="flex flex-col gap-[10px]">
						<li>
							<button
								className="flex items-center gap-[20px] text-(--black-normal) font-medium body-normal"
								onClick={handleLogout}
							>
								<ArrowUpTrayIcon className="w-[24px] h-[24px] stroke-2 rotate-90" />
								Disconnetti l&lsquo;account
							</button>
						</li>
						<li>
							<button
								className="flex items-center gap-[20px] text-(--error-normal) font-medium body-normal"
								onClick={handleUnregister}
							>
								<TrashIcon className="stroke-(--error-normal) w-[24px] h-[24px] stroke-2" />
								Elimina l&lsquo;account
							</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
