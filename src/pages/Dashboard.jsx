import {
	ChevronDownIcon,
	ChevronUpIcon,
	FunnelIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useLeague } from "../contexts/LeagueContext";
import League from "../components/League";
import Loader from "../components/Loader";
import ModalLeague from "../components/modals/ModalLeague";
import GenericPopup from "../components/popups/GenericPopup";
import { useLocation } from "react-router";
import Switch from "../atoms/Inputs/Switch";
import { useParticipant } from "../contexts/ParticipantContext";
import Logo from "../atoms/Logo";
import TabButton from "../atoms/Buttons/TabButton";
import ModalSearchLeague from "../components/modals/ModalSearchLeague";
import { useNotification } from "../contexts/NotificationContext";
import { Bell } from "lucide-react";
import NotificationComponent from "../components/Notification";
import { useModal } from "../contexts/ModalContext";
import FocusModal from "../hooks/FocusModal";

function Dashboard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOpenSearch, setIsModalOpenSearch] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [requestDone, setRequestDone] = useState(false);
	const { user } = useUser();
	const { myLeagues, getMyLeagues, findLeague, allLeagues } = useLeague();
	const { leagues, totalElements } = allLeagues;
	const pages = Math.ceil(totalElements / 6);
	const [pageIndex, setPageIndex] = useState(0);
	const { addParticipant } = useParticipant();

	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		title: "",
		message: "",
	});
	const { state } = useLocation();
	const [deleteLeague, setDeleteLeague] = useState(
		state?.deleteLeague ?? null
	);

	const [enabledSwitch, setEnabledSwitch] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [filterLeagueState, setFilterState] = useState([]);
	const [filteredLeague, setFilteredLeague] = useState(myLeagues);
	const [filterStateOpen, setFilterStateOpen] = useState(false);
	const [searchLeague, setSearchLeague] = useState(false);
	const filterRef = useRef(null);
	const buttonRef = useRef(null);
	const filterDeskRef = useRef(null);
	const buttonDeskRef = useRef(null);
	const { unreadCountNotifications } = useNotification();
	const [isNotifyVisible, setIsNotifyVisible] = useState(false);
	const { openBackdrop, closeBackdrop } = useModal();
	const notifyRef = useRef(null);
	FocusModal(notifyRef, isNotifyVisible);

	useEffect(() => {
		if (deleteLeague !== null) {
			if (deleteLeague) {
				showPopup(
					"success",
					"Lega eliminata.",
					"La lega è stata eliminata correttamente."
				);
			} else {
				showPopup(
					"error",
					"Errore nell'eliminazione della lega",
					"La lega non è stata eliminata correttamente. Riprova."
				);
			}

			setTimeout(() => setDeleteLeague(null), 0);
		}
	}, [deleteLeague]);

	useEffect(() => {
		const fetchData = async () => {
			if (!requestDone) {
				setIsLoading(true);
				const res = await getMyLeagues();
				setFilteredLeague(res);
				setRequestDone(true);
				setIsLoading(false);
			}
		};

		fetchData();
	}, [getMyLeagues, myLeagues, requestDone]);

	useEffect(() => {
		setFilteredLeague(
			myLeagues.filter(
				(el) =>
					(filterLeagueState.length === 0 ||
						filterLeagueState.includes(el.status)) &&
					(!enabledSwitch || el.isAdmin === true)
			)
		);
	}, [filterLeagueState, enabledSwitch, myLeagues]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				(buttonRef.current &&
					buttonRef.current.contains(event.target)) ||
				(buttonDeskRef.current &&
					buttonDeskRef.current.contains(event.target))
			) {
				setShowFilters((prev) => !prev);
				return;
			}

			if (
				(!filterRef.current ||
					!filterRef.current.contains(event.target)) &&
				(!filterDeskRef.current ||
					!filterDeskRef.current.contains(event.target))
			) {
				setShowFilters(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isNotifyVisible) {
			openBackdrop();
		} else {
			closeBackdrop();
		}
	}, [isNotifyVisible]);

	useEffect(() => {
		fetchNewData();
	}, [pageIndex]);

	const fetchNewData = async () => {
		setIsLoading(true);
		await findLeague({
			visibility: ["PUBLIC"],
			status: ["NOT_STARTED", "STARTED", "FINISHED"],
			pagination: { offset: pageIndex, limit: 6 },
		});
		setIsLoading(false);
	};

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleSelect = (event) => {
		const value = event.target.getAttribute("data-value");

		if (value === "ALL") {
			setFilterState([]);
		} else {
			setFilterState((prevState) => {
				if (prevState.includes(value)) {
					return prevState.filter((item) => item !== value);
				} else {
					return [...prevState, value];
				}
			});
		}
	};

	const handleAddParticipant = async (id) => {
		setIsLoading(true);
		const res = await addParticipant(id);
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore nell'iscrizione alla lega!",
				"L'iscrizione a questa lega non é andata a buon fine. Riprova."
			);
			return;
		}
		await getMyLeagues();
		setIsModalOpenSearch(false);
		setIsLoading(false);
		showPopup(
			"success",
			"Iscrizione effettuata!",
			"L'iscrizione a questa lega é andata a buon fine."
		);
	};

	const handleChangeSwitch = () => {
		setEnabledSwitch(!enabledSwitch);
	};

	const handleRemoveSelect = (state) => {
		setFilterState((prevState) => {
			return prevState.filter((item) => item !== state);
		});
	};

	const renderSelectedText = () => {
		if (filterLeagueState.length === 0) {
			return "Tutte";
		}

		switch (filterLeagueState[0]) {
			case "NOT_STARTED":
				return `Pubblicate ${
					filterLeagueState.length - 1 === 0
						? ""
						: "+" + (filterLeagueState.length - 1)
				}`;
			case "STARTED":
				return `Avviate ${
					filterLeagueState.length - 1 === 0
						? ""
						: "+" + (filterLeagueState.length - 1)
				}`;
			case "FINISHED":
				return `Terminate ${
					filterLeagueState.length - 1 === 0
						? ""
						: "+" + (filterLeagueState.length - 1)
				}`;

			default:
				return `Tutte`;
		}
	};

	const handleChangeTab = async (value) => {
		setSearchLeague(value);
		if (value) {
			fetchNewData();
		}
	};

	const getVisiblePages = (current, total) => {
		const visible = [];

		if (total <= 5) {
			return Array.from({ length: total }, (_, i) => i);
		}

		visible.push(0);

		if (current > 2) visible.push("...");

		for (
			let i = Math.max(1, current - 1);
			i <= Math.min(total - 2, current + 1);
			i++
		) {
			visible.push(i);
		}

		if (current < total - 3) visible.push("...");

		if (visible[visible.length - 1] !== total - 1) {
			visible.push(total - 1);
		}

		return visible;
	};

	const toggleNotify = () => {
		setIsNotifyVisible(!isNotifyVisible);
	};

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				if (isNotifyVisible) {
					setIsNotifyVisible(false);
				}
			}
		};

		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [isNotifyVisible]);

	return (
		<>
			{isLoading && <Loader />}
			<div className="hidden lg:fixed lg:top-[8px] lg:left-[370px] lg:flex lg:justify-between lg:w-full lg:items-center lg:px-[20px] lg:py-[20px] lg:border-b-2 lg:border-b-solid lg:border-b-(--black-light-hover) lg:max-w-[calc(100vw-370px)]">
				<Logo />
				<button
					onClick={toggleNotify}
					className="cursor-pointer relative h-fit"
				>
					<Bell className="h-[24px] w-[24px] flex-shrink-0" />
					{unreadCountNotifications > 0 && (
						<>
							<span className="absolute inline-flex w-[8px] h-[8px] animate-ping rounded-full bg-(--error-normal)/80 opacity-75 top-0 right-[2px]"></span>
							<span className="absolute inline-flex w-[8px] h-[8px] rounded-full bg-(--error-normal) top-0 right-[2px]"></span>
						</>
					)}
				</button>
			</div>
			<div
				ref={notifyRef}
				className={`fixed top-0 right-0 h-full w-[370px] bg-white shadow-lg transform transition-transform duration-500 flex flex-col flex-1 z-100 overflow-y-auto ${
					isNotifyVisible ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex flex-col gap-[10px] sticky top-0 bg-white z-1 p-[16px] lg:p-[24px]">
					<div className="flex items-center justify-between gap-[8px]">
						<div className="flex flex-col">
							<p className="body-small">
								Gestisci le tue notifiche
							</p>
							<h3 className="body-normal font-medium">
								Centro notifiche
							</h3>
						</div>
						<button
							onClick={toggleNotify}
							className="p-[8px] rounded-[4px] border border-solid border-(--black-light) cursor-pointer"
						>
							<XMarkIcon className="h-[24px] w-[24px] stroke-2 flex-shrink-0" />
						</button>
					</div>
					<div className="h-[1px] w-full border-t border-t-solid border-t-(--black-light-active)"></div>
				</div>
				<div className="flex flex-col gap-[10px] flex-1 pb-[16px] px-[16px] lg:pb-[24px] lg:px-[24px]">
					<NotificationComponent
						onClose={() => setIsNotifyVisible(!isNotifyVisible)}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-[16px] lg:max-w-[840px] lg:mx-auto">
				<h1 className="title-h4 text-(--primary) break-all">
					Bentornato {user.username}
				</h1>
				<button
					className="w-full px-[24px] py-[10px] text-(--black-normal) rounded-2xl bg-[#FAF8F8] focus:outline-solid focus:outline-[2px] focus:outline-(--black-normal) flex justify-between gap-[8px]"
					onClick={() => setIsModalOpenSearch(true)}
				>
					Cerca una lega a cui iscriverti
					<MagnifyingGlassIcon className="h-[20px] w-[20px]" />
				</button>

				<section className="flex flex-col gap-[16px]">
					<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-normal) md:w-1/2 md:mx-auto">
						<TabButton
							handleClick={() => handleChangeTab(false)}
							active={!searchLeague}
						>
							<p className="body-normal">Mie leghe</p>
						</TabButton>
						<TabButton
							handleClick={() => handleChangeTab(true)}
							active={searchLeague}
						>
							<p className="body-normal">Leghe pubbliche</p>
						</TabButton>
					</div>
					<div className="flex justify-between items-center gap-[8px]">
						<p className="body-regular font-semibold">
							{searchLeague ? "Leghe pubbliche" : "Le tue leghe"}
						</p>
						{myLeagues.length > 0 && !searchLeague && (
							<button
								onClick={() => setIsModalOpen(true)}
								className="flex gap-[8px] items-center cursor-pointer"
							>
								<p className="body-small whitespace-nowrap">
									Crea lega
								</p>
								<PlusIcon className="h-[24px] w-[24px] p-[4px] bg-(--black-light) rounded-full flex-shrink-0" />
							</button>
						)}
					</div>
					<div
						className={`w-full lg:flex lg:gap-[8px] ${
							!searchLeague ? "hidden lg:flex" : ""
						}`}
					>
						{!searchLeague && (
							<div className="relative hidden lg:flex lg:gap-[8px] lg:ml-auto lg:items-center lg:justify-end">
								{showFilters && (
									<div
										ref={filterDeskRef}
										className={`absolute top-[40px] z-3 w-fit min-w-[180px] flex-col gap-[16px] self-end border border-solid border-(--black-light-hover) rounded-[8px] p-[12px] bg-white hidden lg:flex lg:right-0`}
									>
										<div className="flex items-center justify-between">
											<p className="font-semibold">
												Stato
											</p>
											<button
												disabled={
													filterLeagueState.length ===
														0 && !enabledSwitch
												}
												className={`text-[#F87171] font-semibold disabled:text-(--black-light) cursor-pointer`}
												onClick={() => {
													setFilterState([]);
													setEnabledSwitch(false);
												}}
											>
												Reimposta
											</button>
										</div>
										<div className="relative flex flex-col gap-[8px] border border-solid border-(--black-light-active) rounded-[6px] z-50 px-[12px] py-[8px]">
											<div
												className={`flex items-center justify-between gap-[8px] ${
													filterStateOpen &&
													"pb-[8px] border-b border-b-solid border-b-(--black-light-active)"
												}`}
												onClick={() =>
													setFilterStateOpen(
														!filterStateOpen
													)
												}
											>
												<p>{renderSelectedText()}</p>
												{filterStateOpen ? (
													<ChevronUpIcon className="w-[16px] h-[16px] flex-shrink-0" />
												) : (
													<ChevronDownIcon className="w-[16px] h-[16px] flex-shrink-0" />
												)}
											</div>
											{filterStateOpen && (
												<div className="bg-white w-full flex flex-col gap-[8px]">
													<ul className="flex flex-col gap-[8px]">
														<li
															data-value="NOT_STARTED"
															onClick={
																handleSelect
															}
														>
															Pubblicate
														</li>
														<li
															data-value="STARTED"
															onClick={
																handleSelect
															}
														>
															Avviate
														</li>
														<li
															data-value="FINISHED"
															onClick={
																handleSelect
															}
														>
															Terminate
														</li>
													</ul>
												</div>
											)}
										</div>
										<Switch
											enabled={enabledSwitch}
											onChange={handleChangeSwitch}
											text="Create da me"
										/>
									</div>
								)}
								{(filterLeagueState.length > 0 ||
									enabledSwitch) && (
									<ul className="flex items-center gap-[8px] overflow-x-auto">
										{filterLeagueState.map(
											(state, index) => (
												<li
													key={index}
													className="border border-solid border-[#716868] px-[8px] py-[4px] rounded-[5px] flex items-center gap-[4px]"
												>
													<p className="body-normal text-[#716868]">
														{state == "NOT_STARTED"
															? "Pubblicate"
															: state == "STARTED"
															? "Avviate"
															: "Terminate"}
													</p>
													<button
														className="flex cursor-pointer"
														onClick={() =>
															handleRemoveSelect(
																state
															)
														}
													>
														<XMarkIcon className="w-[20px] h-[20px] stroke-[#F87171]" />
													</button>
												</li>
											)
										)}
										{enabledSwitch && (
											<li
												key="Admin"
												className="border border-solid border-[#716868] px-[8px] py-[4px] rounded-[5px] flex items-center gap-[4px]"
											>
												<p className="body-normal text-[#716868]">
													Admin
												</p>
												<button
													className="flex cursor-pointer"
													onClick={() =>
														setEnabledSwitch(false)
													}
												>
													<XMarkIcon className="w-[20px] h-[20px] stroke-[#F87171]" />
												</button>
											</li>
										)}
									</ul>
								)}
								<button
									ref={buttonDeskRef}
									className="items-center gap-[4px] px-[8px] py-[4px] border border-solid border-(--black-normal) rounded-[5px] w-fit filterBtn hidden lg:flex lg:h-[30px] cursor-pointer"
								>
									<FunnelIcon className="h-[20px] w-[20px] filterBtn" />
								</button>
							</div>
						)}
					</div>

					{!searchLeague && (
						<>
							{myLeagues.length !== 0 ? (
								<>
									<div className="relative z-3 flex flex-col gap-[10px] lg:hidden">
										<div className="flex justify-end gap-[12px]">
											{(filterLeagueState.length > 0 ||
												enabledSwitch) && (
												<ul className="flex items-center gap-[8px] overflow-x-auto">
													{filterLeagueState.map(
														(state, index) => (
															<li
																key={index}
																className="border border-solid border-[#716868] px-[8px] py-[4px] rounded-[5px] flex items-center gap-[4px]"
															>
																<p className="body-normal text-[#716868]">
																	{state ==
																	"NOT_STARTED"
																		? "Pubblicate"
																		: state ==
																		  "STARTED"
																		? "Avviate"
																		: "Terminate"}
																</p>
																<button
																	className="flex cursor-pointer"
																	onClick={() =>
																		handleRemoveSelect(
																			state
																		)
																	}
																>
																	<XMarkIcon className="w-[20px] h-[20px] stroke-[#F87171]" />
																</button>
															</li>
														)
													)}
													{enabledSwitch && (
														<li
															key="Admin"
															className="border border-solid border-[#716868] px-[8px] py-[4px] rounded-[5px] flex items-center gap-[4px]"
														>
															<p className="body-normal text-[#716868]">
																Admin
															</p>
															<button
																className="flex cursor-pointer"
																onClick={() =>
																	setEnabledSwitch(
																		false
																	)
																}
															>
																<XMarkIcon className="w-[20px] h-[20px] stroke-[#F87171]" />
															</button>
														</li>
													)}
												</ul>
											)}

											<button
												ref={buttonRef}
												className="flex items-center gap-[4px] px-[8px] py-[4px] border border-solid border-(--black-normal) rounded-[5px] w-fit filterBtn cursor-pointer"
											>
												<FunnelIcon className="h-[20px] w-[20px] filterBtn" />
											</button>
										</div>

										{showFilters && (
											<div
												ref={filterRef}
												className={`absolute top-[40px] z-3 w-fit min-w-[180px] flex flex-col gap-[16px] self-end border border-solid border-(--black-light-hover) rounded-[8px] p-[12px] bg-white lg:hidden`}
											>
												<div className="flex items-center justify-between">
													<p className="font-semibold">
														Stato
													</p>
													<button
														disabled={
															filterLeagueState.length ===
																0 &&
															!enabledSwitch
														}
														className={`text-[#F87171] font-semibold disabled:text-(--black-light) cursor-pointer`}
														onClick={() => {
															setFilterState([]);
															setEnabledSwitch(
																false
															);
														}}
													>
														Reimposta
													</button>
												</div>
												<div className="relative flex flex-col gap-[8px] border border-solid border-(--black-light-active) rounded-[6px] z-50 px-[12px] py-[8px]">
													<div
														className={`flex items-center justify-between gap-[8px] ${
															filterStateOpen &&
															"pb-[8px] border-b border-b-solid border-b-(--black-light-active)"
														}`}
														onClick={() =>
															setFilterStateOpen(
																!filterStateOpen
															)
														}
													>
														<p>
															{renderSelectedText()}
														</p>
														{filterStateOpen ? (
															<ChevronUpIcon className="w-[16px] h-[16px] flex-shrink-0" />
														) : (
															<ChevronDownIcon className="w-[16px] h-[16px] flex-shrink-0" />
														)}
													</div>
													{filterStateOpen && (
														<div className="bg-white w-full flex flex-col gap-[8px]">
															<ul className="flex flex-col gap-[8px]">
																<li
																	data-value="NOT_STARTED"
																	onClick={
																		handleSelect
																	}
																>
																	Pubblicate
																</li>
																<li
																	data-value="STARTED"
																	onClick={
																		handleSelect
																	}
																>
																	Avviate
																</li>
																<li
																	data-value="FINISHED"
																	onClick={
																		handleSelect
																	}
																>
																	Terminate
																</li>
															</ul>
														</div>
													)}
												</div>
												<Switch
													enabled={enabledSwitch}
													onChange={
														handleChangeSwitch
													}
													text="Create da me"
												/>
											</div>
										)}
									</div>

									{filteredLeague?.length > 0 ? (
										<ul className="flex flex-col gap-[10px] lg:grid lg:grid-cols-2 lg:gap-[20px]">
											{filteredLeague.map((el) => (
												<League
													key={el.id}
													league={el}
													onAddParticipant={
														handleAddParticipant
													}
												/>
											))}
										</ul>
									) : (
										<p className="text-center text-gray-500">
											Nessuna lega disponibile per il
											filtro selezionato
										</p>
									)}
								</>
							) : (
								<p className="body-normal font-semibold text-(--black-darker) text-center">
									Sembra che tu non abbia ancora una lega.
									Cerca una nuova lega oppure creane una da
									zero.
								</p>
							)}
						</>
					)}
				</section>

				{myLeagues.length === 0 && !searchLeague && (
					<button
						onClick={() => setIsModalOpen(true)}
						className="group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-white bg-(--accent-normal) md:w-1/2 md:mx-auto cursor-pointer"
					>
						<span>Crea una nuova lega</span>
						<PlusIcon className="h-[24px] w-[24px] text-(--black-normal) bg-white p-[4px] rounded-full flex-shrink-0" />
					</button>
				)}

				{searchLeague && (
					<>
						{totalElements > 0 ? (
							<ul className="flex flex-col gap-[10px] lg:grid lg:grid-cols-2 lg:gap-[20px]">
								{leagues.map((el) => (
									<League
										key={el.id}
										league={el}
										onAddParticipant={handleAddParticipant}
									/>
								))}
							</ul>
						) : (
							<p className="body-normal font-semibold text-(--black-darker) text-center">
								Sembra che non ci siano leghe pubbliche a cui
								puoi iscriverti.
							</p>
						)}
					</>
				)}

				{pages > 1 && searchLeague && (
					<div className="flex justify-center gap-[8px]">
						{getVisiblePages(pageIndex, pages).map(
							(item, index) => {
								if (item === "...") {
									return (
										<span
											key={index}
											className="w-[30px] h-[30px] flex items-center justify-center text-(--accent-normal)"
										>
											...
										</span>
									);
								}

								return (
									<button
										key={index}
										onClick={() => setPageIndex(item)}
										className={`${
											pageIndex === item
												? "bg-(--accent-normal)"
												: "bg-(--black-light)"
										} flex items-center justify-center rounded-[4px] w-[30px] h-[30px] text-white`}
									>
										{item + 1}
									</button>
								);
							}
						)}
					</div>
				)}

				<ModalSearchLeague
					isOpen={isModalOpenSearch}
					onClose={() => setIsModalOpenSearch(false)}
					onAddParticipant={handleAddParticipant}
				/>
				<ModalLeague
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onCreate={showPopup}
				/>

				<GenericPopup
					isOpen={popupData.isOpen}
					type={popupData.type}
					title={popupData.title}
					message={popupData.message}
				/>
			</div>
		</>
	);
}

export default Dashboard;
