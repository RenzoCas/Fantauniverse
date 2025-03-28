import { FunnelIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useLeague } from "../contexts/LeagueContext";
import GenericInput from "../atoms/Inputs/GenericInput";
import Lega from "../components/League";
import Loader from "../components/Loader";
import ModalLeague from "../components/modals/ModalLeague";
import GenericPopup from "../components/popups/GenericPopup";
import { useLocation } from "react-router";
import ModalSearchLeague from "../components/modals/ModalSearchLeague";
import Switch from "../atoms/Inputs/Switch";

function Dashboard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalSearchOpen, setIsModalSearchOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [requestDone, setRequestDone] = useState(false);
	const { user } = useUser();
	const { myLeagues, getMyLeagues, findLeague, allLeagues } = useLeague();
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
	const [filterLeagueState, setFilterState] = useState("ALL");
	const [filteredLeague, setFilteredLeague] = useState(myLeagues);
	const filterRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				filterRef.current &&
				!filterRef.current.contains(event.target)
			) {
				setShowFilters(false);
			}
		}
		// Aggiunge l'event listener quando showFilters è true
		if (showFilters) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			// Rimuove l'event listener quando il componente si smonta o showFilters cambia
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showFilters]);

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
					(filterLeagueState === "ALL" ||
						el.status === filterLeagueState) &&
					(!enabledSwitch || el.isAdmin === true)
			)
		);
	}, [filterLeagueState, enabledSwitch, myLeagues]);

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
			if (!res) {
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

	return (
		<>
			{isLoading && <Loader />}
			<div className="flex flex-col gap-[30px]">
				<h1 className="title-h4 text-(--primary)">
					Bentornato, <br /> {user.username}
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
							<div className="relative flex flex-col gap-[10px]">
								<button
									className="flex items-center self-end gap-[4px] px-[8px] py-[4px] border border-solid border-(--black-normal) rounded-[5px] w-fit"
									onClick={() => setShowFilters(!showFilters)}
								>
									<p>Filtri</p>
									<FunnelIcon className="h-[20px] w-[20px]" />
								</button>
								{showFilters && (
									<div
										ref={filterRef}
										className={`absolute top-[40px] w-fit min-w-[180px] flex flex-col gap-[16px] self-end border border-solid border-(--black-light-hover) rounded-[8px] p-[12px] bg-white`}
									>
										<div className="flex items-center justify-between">
											<p className="font-semibold">
												Stato
											</p>
											<button
												className="text-[#F87171] font-semibold"
												onClick={() => {
													setFilterState("ALL");
													setEnabledSwitch(false);
												}}
											>
												Reimposta
											</button>
										</div>
										<select
											className="px-[12px] py-[4px] border border-solid border-(--black-light-hover) rounded-[5px] w-full"
											onChange={(e) => {
												setFilterState(e.target.value);
											}}
											value={filterLeagueState}
										>
											<option value="ALL">Tutte</option>
											<option value="NOT_STARTED">
												Non avviate
											</option>
											<option value="STARTED">
												Avviate
											</option>
											<option value="FINISHED">
												Terminate
											</option>
										</select>
										<Switch
											enabled={enabledSwitch}
											onChange={() =>
												setEnabledSwitch(!enabledSwitch)
											}
											text="Create da me"
										/>
									</div>
								)}
							</div>
							{filteredLeague.length > 0 ? (
								<ul className="flex flex-col gap-[10px]">
									{filteredLeague.map((el) => (
										<Lega key={el.id} league={el} />
									))}
								</ul>
							) : (
								<p className="text-center text-gray-500">
									Nessuna lega disponibile per il filtro
									selezionato
								</p>
							)}
							{/* <ul className="flex flex-col gap-[10px]">
								{myLeagues
									.filter(
										(el) =>
											filterLeagueState === "ALL" ||
											el.status === filterLeagueState
									)
									.map((el) => (
										<Lega key={el.id} league={el} />
									))}
							</ul> */}
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
