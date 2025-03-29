import {
	ChevronDownIcon,
	ChevronUpIcon,
	FunnelIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useLeague } from "../contexts/LeagueContext";
import GenericInput from "../atoms/Inputs/GenericInput";
import League from "../components/League";
import Loader from "../components/Loader";
import ModalLeague from "../components/modals/ModalLeague";
import GenericPopup from "../components/popups/GenericPopup";
import { useLocation } from "react-router";
import ModalSearchLeague from "../components/modals/ModalSearchLeague";
import Switch from "../atoms/Inputs/Switch";
import { useParticipant } from "../contexts/ParticipantContext";

function Dashboard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalSearchOpen, setIsModalSearchOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [requestDone, setRequestDone] = useState(false);
	const { user } = useUser();
	const { myLeagues, getMyLeagues, findLeague, allLeagues } = useLeague();
	const { addParticipant } = useParticipant();
	const [formData, setFormData] = useState({
		leagueName: "",
	});

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
	const filterRef = useRef(null);
	const buttonRef = useRef(null);

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
			if (buttonRef.current && buttonRef.current.contains(event.target)) {
				setShowFilters((prev) => !prev);
				return;
			}

			if (
				filterRef.current &&
				!filterRef.current.contains(event.target)
			) {
				setShowFilters(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		if (formData.leagueName.trim() != "") {
			const res = await findLeague(formData.leagueName);
			if (res.length == 0) {
				showPopup(
					"error",
					"Lega non esistente!",
					"La lega cercata non esiste. Riprova."
				);
				setIsLoading(false);
				return;
			}
			setIsLoading(false);
			setIsModalSearchOpen(true);
		}
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
		setIsModalSearchOpen(false);
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

	return (
		<>
			{isLoading && <Loader />}
			<div className="flex flex-col gap-[16px]">
				<h1 className="title-h4 text-(--primary)">
					Bentornato {user.username}
				</h1>
				<section className="flex flex-col gap-[16px]">
					<div className="flex justify-between items-center gap-[8px]">
						<p className="body-regular font-semibold">
							Le tue leghe
						</p>
						{myLeagues.length > 0 && (
							<button
								onClick={() => setIsModalOpen(true)}
								className="flex gap-[8px] items-center"
							>
								<p className="body-small whitespace-nowrap">
									Crea lega
								</p>
								<PlusIcon className="h-[24px] w-[24px] p-[4px] bg-(--black-light) rounded-full" />
							</button>
						)}
					</div>
					<form onSubmit={handleSubmit}>
						<GenericInput
							type="text"
							name="leagueName"
							id="searchLeaga"
							placeholder="Cerca una lega a cui iscriverti"
							value={formData.leagueName}
							handleChange={handleChange}
						/>
					</form>

					{myLeagues.length !== 0 ? (
						<>
							<div className="relative z-3 flex flex-col gap-[10px]">
								<div className="flex justify-end gap-[12px]">
									{(filterLeagueState.length > 0 ||
										enabledSwitch) && (
										<ul className="flex items-center gap-[8px] overflow-x-auto hide-scrollbar">
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
															className="flex"
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
														className="flex"
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
										className="flex items-center gap-[4px] px-[8px] py-[4px] border border-solid border-(--black-normal) rounded-[5px] w-fit filterBtn"
									>
										<FunnelIcon className="h-[20px] w-[20px] filterBtn" />
									</button>
								</div>

								{showFilters && (
									<div
										ref={filterRef}
										className={`absolute top-[40px] z-3 w-fit min-w-[180px] flex flex-col gap-[16px] self-end border border-solid border-(--black-light-hover) rounded-[8px] p-[12px] bg-white`}
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
												className={`text-[#F87171] font-semibold disabled:text-(--black-light)`}
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
													<ChevronUpIcon className="w-[16px] h-[16px]" />
												) : (
													<ChevronDownIcon className="w-[16px] h-[16px]" />
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
							</div>
							{filteredLeague.length > 0 ? (
								<ul className="flex flex-col gap-[10px]">
									{filteredLeague.map((el) => (
										<League key={el.id} league={el} />
									))}
								</ul>
							) : (
								<p className="text-center text-gray-500">
									Nessuna lega disponibile per il filtro
									selezionato
								</p>
							)}
						</>
					) : (
						<p className="body-normal font-semibold text-(--black-darker) text-center">
							Sembra che tu non abbia ancora una lega. Cerca una
							nuova lega oppure creane una da zero.
						</p>
					)}
				</section>

				{myLeagues.length === 0 && (
					<button
						onClick={() => setIsModalOpen(true)}
						className="group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-white bg-(--accent-normal)"
					>
						<span>Crea una nuova lega</span>
						<PlusIcon className="h-[24px] w-[24px] text-(--black-normal) bg-white p-[4px] rounded-full" />
					</button>
				)}
				<ModalSearchLeague
					isOpen={isModalSearchOpen}
					onClose={() => setIsModalSearchOpen(false)}
					leaguesFound={allLeagues}
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
