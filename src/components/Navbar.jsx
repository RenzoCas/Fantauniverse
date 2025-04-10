import {
	ArrowUpTrayIcon,
	Bars3Icon,
	ChatBubbleOvalLeftEllipsisIcon,
	ChevronRightIcon,
	Cog6ToothIcon,
	ExclamationCircleIcon,
	HomeIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import Logo from "../atoms/Logo";
import { useLeague } from "../contexts/LeagueContext";
import Loader from "./Loader";
import GenericPopup from "./popups/GenericPopup";
import ModalConfirmAction from "./modals/ModalConfirmAction";

export default function Navbar() {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, logout, unregister } = useUser();
	const { icon, username } = user;
	const { myLeagues } = useLeague();
	const [randomColors, setRandomColors] = useState([]);
	const [visibleCount, setVisibleCount] = useState(3);
	const [isLoading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	const [isModalConfirmOpen, setIsModalConfirmOpen] = useState({
		action: null,
		value: false,
	});

	const [dataModalConfirm, setDataModalConfirm] = useState({
		title: "",
		text: "",
		conferma: "",
		annulla: "",
	});

	useEffect(() => {
		const numColors = myLeagues?.length + 1;

		const colors = Array.from({ length: numColors }, () =>
			randomLightColor()
		);
		setRandomColors(colors);
	}, [myLeagues]);

	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		// Cleanup per ripristinare l'overflow quando il componente viene smontato
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isMenuOpen]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		setVisibleCount(3);
	};

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	const showModalConfirmUnregister = () => {
		setDataModalConfirm({
			title: "Elimina account",
			text: "Confermando il tuo account verrá definitivamente cancellato.",
			conferma: "Conferma",
			annulla: "Annulla",
		});
		setIsModalConfirmOpen({ action: "delete", value: true });
	};

	const handleUnregister = async () => {
		setIsModalConfirmOpen({ action: null, value: false });
		setIsLoading(true);
		const res = await unregister();
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Account non eliminato!",
				"C'é stato un problema nella cancellazione dell'account. Riprova."
			);
			return;
		}
		setIsLoading(false);
		showPopup(
			"success",
			"Account eliminato!",
			"L'account é stato elimiato correttamente."
		);
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
		<>
			{isLoading && <Loader />}
			<nav className="bg-white py-[8px] px-[16px] sticky top-0 flex lg:hidden justify-between items-center border-b-[2px] border-black relative z-100">
				<Logo />
				<div className="flex gap-3 items-center">
					<button onClick={toggleMenu} className="cursor-pointer">
						<Bars3Icon className="h-[24px] w-[24px] flex-shrink-0" />
					</button>
				</div>

				<div
					className={`fixed top-0 right-0 h-full w-full bg-(--black-normal)/50 ${
						isMenuOpen ? "flex" : "hidden"
					}`}
					onClick={toggleMenu}
				></div>
				<div
					className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-500 px-[16px] py-[24px] flex flex-col gap-[10px] flex-1 ${
						isMenuOpen ? "translate-x-0" : "translate-x-full"
					}`}
				>
					<div className="flex items-center justify-between gap-[8px]">
						<div className="flex gap-[20px] items-center">
							<picture className="rounded-lg min-w-[50px] max-w-[50px] h-[50px] overflow-hidden relative">
								{icon == null ? (
									<div
										className={`h-full object-cover`}
										style={{
											backgroundColor: randomColors[0],
										}}
									>
										<div className="body-regular font-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex items-center justify-center w-full h-full">
											{username.slice(0, 2).toUpperCase()}
										</div>
									</div>
								) : (
									<img
										src={`data:image/png;base64,${icon}`}
										alt={`Icona utente`}
										className="h-full object-cover"
										loading="lazy"
									/>
								)}
							</picture>
							<h3 className="body-regular">
								Bentornato, <br />
								<span className="font-medium break-all">
									{username}
								</span>
							</h3>
						</div>
						<button
							onClick={toggleMenu}
							className="p-[8px] rounded-[4px] border border-solid border-(--black-light) cursor-pointer"
						>
							<XMarkIcon className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
						</button>
					</div>
					<div className="h-[16px] w-full border-t border-t-solid border-t-(--black-light-active)"></div>
					<div className="flex flex-col gap-[10px] flex-1 overflow-y-auto">
						<div className="flex flex-col gap-[10px]">
							<h2 className="body-regular text-[#B0B0B0] font-semibold">
								Le tue leghe
							</h2>
							{myLeagues?.length > 0 ? (
								<>
									<ul className="flex flex-col gap-[10px]">
										{myLeagues
											.slice(0, visibleCount)
											.map((league, idx) => (
												<li
													key={league.id}
													className="flex items-center gap-[20px]"
													onClick={() =>
														handleClickLeague(
															league
														)
													}
												>
													<picture className="rounded-lg min-w-[50px] max-w-[50px] h-[50px] overflow-hidden relative">
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
																loading="lazy"
															/>
														)}
													</picture>
													<h4 className="body-normal font-medium break-all">
														{league.name}
													</h4>
													<ChevronRightIcon className="h-[24px] w-[24px] ml-auto stroke-2 flex-shrink-0" />
												</li>
											))}
									</ul>
									{visibleCount < myLeagues.length && (
										<button
											onClick={loadMore}
											className="cursor-pointer"
										>
											Carica di più
										</button>
									)}
								</>
							) : (
								<>
									<p className="body-normal font-medium text-(--black-normal)">
										Sembra che tu non abbia ancora una lega.
										Cerca una nuova lega oppure creane una
										da zero.
									</p>
									<ul className="flex flex-col gap-[10px]">
										<li>
											<button
												className="flex items-center gap-[20px] text-(--black-normal) font-medium body-normal w-full text-left cursor-pointer"
												onClick={() =>
													handleClickLink("/app")
												}
											>
												<HomeIcon className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
												<span className="body-normal font-medium text-(--black-normal)">
													Vai alla Dashboard
												</span>
												<ChevronRightIcon className="h-[24px] w-[24px] ml-auto stroke-2 flex-shrink-0" />
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
								{myLeagues?.length > 0 && (
									<li>
										<button
											className="flex gap-[20px] text-(--black-normal) w-full text-left cursor-pointer"
											onClick={() =>
												handleClickLink("/app")
											}
										>
											<HomeIcon className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
											<span className="body-normal font-medium text-(--black-normal) self-center">
												Vai alla Dashboard
											</span>
											<ChevronRightIcon className="h-[24px] w-[24px] ml-auto stroke-2 flex-shrink-0" />
										</button>
									</li>
								)}
								<li>
									<button
										className="flex gap-[20px] text-(--black-normal) w-full text-left cursor-pointer"
										onClick={() =>
											handleClickLink("account")
										}
									>
										<Cog6ToothIcon className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
										<span className="body-normal font-medium text-(--black-normal) self-center flex-shrink-0">
											Modifica il tuo profilo
										</span>
										<ChevronRightIcon className="h-[24px] w-[24px] ml-auto stroke-2 flex-shrink-0" />
									</button>
								</li>
								<li>
									<button
										className="flex gap-[20px] text-(--black-normal) w-full text-left cursor-pointer"
										onClick={() => handleClickLink("rules")}
									>
										<ExclamationCircleIcon className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
										<span className="body-normal font-medium text-(--black-normal) self-center">
											Come funziona?
										</span>
										<ChevronRightIcon className="h-[24px] w-[24px] ml-auto stroke-2 flex-shrink-0" />
									</button>
								</li>
								<li>
									<button
										className="flex gap-[20px] text-(--black-normal) w-full text-left cursor-pointer"
										onClick={() => handleClickLink("faq")}
									>
										<ChatBubbleOvalLeftEllipsisIcon className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
										<span className="body-normal font-medium text-(--black-normal) self-center">
											Hai bisogno di aiuto? Controlla le
											nostre FAQ
										</span>
										<ChevronRightIcon className="h-[24px] w-[24px] ml-auto stroke-2 flex-shrink-0" />
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
									className="flex items-center gap-[20px] text-(--black-normal) font-medium body-normal cursor-pointer"
									onClick={handleLogout}
								>
									<ArrowUpTrayIcon className="w-[24px] h-[24px] stroke-2 rotate-90 flex-shrink-0" />
									Disconnetti l&lsquo;account
								</button>
							</li>
							<li>
								<button
									className="flex items-center gap-[20px] text-(--error-normal) font-medium body-normal cursor-pointer"
									onClick={showModalConfirmUnregister}
								>
									<TrashIcon className="stroke-(--error-normal) w-[24px] h-[24px] stroke-2 flex-shrink-0" />
									Elimina l&lsquo;account
								</button>
							</li>
						</ul>
					</div>
				</div>
				<GenericPopup
					isOpen={popupData.isOpen}
					type={popupData.type}
					title={popupData.title}
					message={popupData.message}
				/>
			</nav>
			<ModalConfirmAction
				isOpen={isModalConfirmOpen.value}
				onClose={() =>
					setIsModalConfirmOpen({ action: null, value: false })
				}
				onConfirmAction={handleUnregister}
				dataModal={dataModalConfirm}
			/>
		</>
	);
}
