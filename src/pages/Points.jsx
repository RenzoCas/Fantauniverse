import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import DayTab from "../atoms/DayTab";
import DayPlayer from "../components/DayPlayer";
import { useLeague } from "../contexts/LeagueContext";
import NormalButton from "../atoms/Buttons/NormalButton";
import {
	PlusIcon,
	TrashIcon,
	WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import ModalCreateDay from "../components/modals/ModalCreateDay";
import Loader from "../components/Loader";
import GenericPopup from "../components/popups/GenericPopup";
import GhostButton from "../atoms/Buttons/GhostButton";
import { useDay } from "../contexts/DayContext";
import ModalAddPoints from "../components/modals/ModalAddPoints";
import {
	ChevronLeft,
	CircleChevronLeft,
	CircleChevronRight,
} from "lucide-react";
import TabButton from "../atoms/Buttons/TabButton";
import Rule from "../components/Rule";

function Points() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalAddPointsOpen, setIsModalAddPointsOpen] = useState({
		rule: null,
		value: false,
	});
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState(null);
	const { league } = useLeague();
	const { days, status, isAdmin, rules } = league;
	const { getDay, createDay, deleteDay, updateDay } = useDay();
	const [isloading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});

	const [activeDay, setActiveDay] = useState();
	const [tempDay, setTempDay] = useState({
		leagueId: league.id,
		id: days[activeIndex]?.id || null,
		name: days[activeIndex]?.name || "",
		date: days[activeIndex]?.date || Date.now(),
		players: days[activeIndex]?.players || [],
	});
	const [infoDay, setInfoDay] = useState();
	const [isUpdateDay, setIsUpdateDay] = useState(false);
	const [tabActive, setTabActive] = useState("Bonus");

	useEffect(() => {
		const newActiveDay = days[activeIndex];
		setActiveDay(newActiveDay);
		fetchInfoDay(newActiveDay.id);
	}, [activeIndex]);

	const fetchInfoDay = async (dayId) => {
		try {
			const response = await getDay(dayId);
			setInfoDay(response);
			setTempDay(response);
			setTempDay((prev) => ({ ...prev, leagueId: league.id }));
		} catch (error) {
			console.error("Errore nel recupero di infoDay:", error);
		}
	};

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleTabClick = (index) => {
		if (swiperInstance) {
			swiperInstance.slideTo(index);
		}
		setActiveIndex(index);
	};

	const formatDate = (isoString) => {
		const date = new Date(isoString);
		return date.toLocaleDateString("it-IT", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const handleSubmit = async (formData) => {
		setIsLoading(true);
		setIsModalOpen(false);
		let result = null;
		if (isUpdateDay) {
			result = await updateDay(tempDay);
		} else {
			result = await createDay(formData);
		}

		setInfoDay(tempDay);
		setIsLoading(false);
		if (!result) {
			showPopup(
				"error",
				"Errore nella creazione della giornata!",
				"La giornata non é stata aggiunta correttamente. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Giornata aggiunta!",
			"La giornata é stata creata correttamente."
		);

		if (!isUpdateDay) {
			setActiveIndex(() => {
				const newIndex = result.days.length - 1;

				setTimeout(() => {
					if (swiperInstance) {
						swiperInstance.slideTo(newIndex);
					}
				}, 100);

				return newIndex;
			});
		}
		setIsUpdateDay(false);
	};

	const handleDeleteDay = async () => {
		setIsLoading(true);
		const result = await deleteDay(activeDay.id);
		setIsLoading(false);
		if (!result) {
			showPopup(
				"error",
				"Errore nell'eliminazione della giornata!",
				"La giornata non é stata eliminata correttamente. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Giornata eliminata!",
			"La giornata é stata eliminata correttamente."
		);
		setActiveIndex((prevIndex) => {
			const newIndex =
				days.length - 1 > 0 ? Math.max(0, prevIndex - 1) : 0;

			setTimeout(() => {
				if (swiperInstance) {
					swiperInstance.slideTo(newIndex);
				}
			}, 100);

			return newIndex;
		});
	};

	const handleCancelUpdate = async () => {
		setTempDay(infoDay);
		setIsUpdateDay(false);
	};

	const confirmRuleForPlayers = async (ruleObj, selectedPlayers) => {
		await setTempDay((prev) => {
			// Costruiamo un nuovo array di players aggiornato
			const updatedPlayers = [...prev.players];

			selectedPlayers.forEach((player) => {
				const existing = updatedPlayers.find(
					(p) => p.player.id === player.id
				);

				if (existing) {
					// Rimuoviamo la regola se già esiste
					const newRules = existing.rules.filter(
						(r) => r.id !== ruleObj.id
					);
					// La ri-aggiungiamo
					newRules.push(ruleObj);

					const updatedPoints = newRules.reduce((acc, rule) => {
						return rule.malus ? acc - rule.value : acc + rule.value;
					}, 0);

					existing.rules = newRules;
					existing.points = updatedPoints;
				} else {
					// Se non esiste, lo creiamo ex novo
					updatedPlayers.push({
						player,
						rules: [ruleObj],
						points: ruleObj.malus ? -ruleObj.value : ruleObj.value,
					});
				}
			});

			return {
				...prev,
				players: updatedPlayers,
			};
		});
	};

	const handleRemovePlayer = async (player) => {
		await setTempDay((prev) => {
			const updatedPlayers = prev.players.filter(
				(p) => p.player.id !== player.player.id
			);

			return {
				...prev,
				players: updatedPlayers,
			};
		});
	};

	const handleTabChange = (tab) => {
		setTabActive(tab);
	};

	return (
		<>
			{isloading && <Loader />}
			{days.length === 0 ? (
				isAdmin && status != "FINISHED" ? (
					<>
						<p className="body-normal font-semibold text-black text-center">
							Sembra che tu non abbia ancora aggiunto nessuna
							giornata. Creane una da zero.
						</p>
						<NormalButton
							text="Crea una nuova giornata"
							action={() => setIsModalOpen(true)}
							customIcon
						>
							<PlusIcon className="h-6 w-6 text-black bg-white p-1 rounded-full" />
						</NormalButton>
					</>
				) : (
					<div className="flex flex-col gap-[16px]">
						<h2 className="title-h4 font-medium break-all">
							{league.name}
						</h2>
						<p className="body-normal font-semibold text-black text-center">
							Non sono ancora presenti giornate per questa lega.
						</p>
					</div>
				)
			) : (
				<>
					<div className="flex flex-col gap-[16px] flex-1">
						<div className="flex items-center justify-between lg:justify-end">
							<h2 className="title-h4 font-medium break-all lg:hidden">
								{league.name}
							</h2>
							{isAdmin && status != "FINISHED" && (
								<button
									className="flex gap-[4px] body-small font-semibold whitespace-nowrap cursor-pointer"
									onClick={() => setIsModalOpen(true)}
								>
									Aggiungi giornata
								</button>
							)}
						</div>
						<div className="flex flex-col gap-[12px] relative">
							<button
								className={`hidden lg:block swiper-button-prev absolute top-[20px] left-0 transform -translate-y-1/2 z-10`}
								onClick={() => swiperInstance?.slidePrev()}
							>
								<CircleChevronLeft className="h-[24px] w-[24px]" />
							</button>
							<Swiper
								slidesPerView={3}
								spaceBetween={10}
								centeredSlides
								initialSlide={activeIndex}
								onSlideChange={(swiper) =>
									setActiveIndex(swiper.realIndex)
								}
								onSwiper={setSwiperInstance}
								speed={500}
								className="w-full lg:max-w-[550px] lg:px-[40px]"
								navigation={true}
							>
								{days.map((el, idx) => (
									<SwiperSlide key={el.id}>
										<DayTab
											day={el}
											isActive={idx === activeIndex}
											handleClick={() =>
												handleTabClick(idx)
											}
										/>
									</SwiperSlide>
								))}
							</Swiper>
							<button
								className="hidden lg:block swiper-button-next absolute top-[20px] right-0 transform -translate-y-1/2 z-10"
								onClick={() => swiperInstance?.slideNext()}
							>
								<CircleChevronRight className="h-[24px] w-[24px]" />
							</button>
							<p className="body-normal text-(--black-light-active) text-center">
								Giocata il {formatDate(days[activeIndex].date)}
							</p>
						</div>
						{isUpdateDay ? (
							<div className="flex flex-col gap-[16px]">
								<button
									onClick={handleCancelUpdate}
									className="flex items-center self-center gap-[4px] text-(--black-light-active) cursor-pointer"
								>
									<ChevronLeft className="h-[16px] w-[16px] stroke-(--black-light-active)" />
									<p className="body-normal">
										Annulla le modifiche e torna indietro
									</p>
								</button>
								<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-dark) lg:w-1/2 lg:self-center">
									<TabButton
										handleClick={() =>
											handleTabChange("Bonus")
										}
										active={tabActive === "Bonus"}
									>
										<p className="body-normal">Bonus</p>
									</TabButton>
									<TabButton
										handleClick={() =>
											handleTabChange("Malus")
										}
										active={tabActive === "Malus"}
									>
										<p className="body-normal">Malus</p>
									</TabButton>
								</div>
								<ul className="flex flex-col gap-[12px]">
									{rules
										.filter(
											(el) =>
												el.malus ===
												(tabActive === "Malus")
										)
										.map((el, idx) => (
											<Rule
												key={idx}
												ruleObj={el}
												isAddPoints={true}
												playersRule={tempDay.players}
												onRemovePlayer={
													handleRemovePlayer
												}
												openModalAddPoints={
													setIsModalAddPointsOpen
												}
											/>
										))}
								</ul>
								<div className="flex flex-col gap-[8px]">
									<NormalButton
										text="Salva punteggi"
										icon={false}
										action={() => {
											handleSubmit();
										}}
										classOpt={"lg:w-1/2 lg:mx-auto"}
									/>
								</div>
								<ModalAddPoints
									isOpen={isModalAddPointsOpen.value}
									ruleObj={isModalAddPointsOpen.rule}
									onClose={() =>
										setIsModalAddPointsOpen({
											rule: null,
											value: false,
										})
									}
									playersSelected={tempDay.players}
									onConfirm={confirmRuleForPlayers}
								/>
							</div>
						) : (
							<>
								{infoDay?.players.length > 0 ? (
									<>
										{isAdmin && status != "FINISHED" && (
											<button
												onClick={() =>
													setIsUpdateDay(true)
												}
												className="flex items-center gap-[8px] justify-center w-fit self-center cursor-pointer"
											>
												<p className="body-normal">
													Modifica punteggi
												</p>
												<WrenchScrewdriverIcon className="h-[20px] w-[20px]" />
											</button>
										)}
										<div className="flex flex-col">
											{infoDay?.players?.map(
												(el, idx) => (
													<DayPlayer
														key={idx}
														playerObj={el.player}
														rules={el.rules}
														dayPoints={el.points}
													/>
												)
											)}
										</div>
									</>
								) : (
									<p className="body-normal text-(black-normal) font-semibold text-center">
										Punteggi di giornata non ancora inseriti
									</p>
								)}
								{isAdmin && status != "FINISHED" && (
									<div className="flex gap-[8px] mt-auto justify-center">
										<GhostButton
											text="Elimina"
											customIcon={true}
											action={handleDeleteDay}
											classOpt={`self-center border border-solid text-(--error-normal) active:bg-(--error-normal) active:text-white hover:bg-(--error-light-hover)`}
										>
											<TrashIcon className="h-[20px] w-[20px] stroke-(--error-normal) group-active:stroke-white" />
										</GhostButton>
										{infoDay?.players.length == 0 && (
											<NormalButton
												text="Modifica"
												customIcon={true}
												icon={false}
												action={() =>
													setIsUpdateDay(true)
												}
											>
												<WrenchScrewdriverIcon className="h-[20px] w-[20px]" />
											</NormalButton>
										)}
									</div>
								)}
							</>
						)}
					</div>
				</>
			)}

			<ModalCreateDay
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				handleSubmit={handleSubmit}
			/>

			<GenericPopup
				isOpen={popupData.isOpen}
				type={popupData.type}
				title={popupData.title}
				message={popupData.message}
			/>
		</>
	);
}

export default Points;
