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
import Player from "../components/Player";
import ModalAddPoints from "../components/modals/ModalAddPoints";

function Points() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalAddPointsOpen, setIsModalAddPointsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState(null);
	const { league } = useLeague();
	const { days, status, isAdmin, players, rules } = league;
	const { getDay, createDay, deleteDay, updateDay } = useDay();
	const [isloading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});

	const [activeDay, setActiveDay] = useState();
	const [tempDay, setTempDay] = useState({
		id: days[activeIndex]?.id || null,
		name: days[activeIndex]?.name || "",
		date: days[activeIndex]?.date || Date.now(),
		players: days[activeIndex]?.players || [],
	});
	const [infoDay, setInfoDay] = useState();
	const [isUpdateDay, setIsUpdateDay] = useState(false);

	useEffect(() => {
		const newActiveDay = days[activeIndex];
		setActiveDay(newActiveDay);

		if (newActiveDay?.id) {
			fetchInfoDay(newActiveDay.id);
		}
	}, [activeIndex]);

	const fetchInfoDay = async (dayId) => {
		try {
			const response = await getDay(dayId);
			setInfoDay(response);
			setTempDay(response);
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

	const [playerObj, setPlayeObj] = useState(players[0]);
	const handleAddPoints = (player) => {
		setPlayeObj(player);
		setIsModalAddPointsOpen(true);
	};

	const handleCancelUpdate = async () => {
		setTempDay(infoDay);
		setIsUpdateDay(false);
	};

	const confirmPlayerRules = async (player, selectedRules) => {
		await setTempDay((prev) => {
			const playerExists = prev.players.some(
				(p) => p.player.id === player.id
			);

			const points = selectedRules.reduce((total, rule) => {
				const matchingRule = rules.find((r) => r.id === rule);
				if (matchingRule) {
					return matchingRule.malus
						? total - matchingRule.value
						: total + matchingRule.value;
				}
				return total;
			}, 0);

			const updatedPlayers = playerExists
				? prev.players.map((p) =>
						p.player.id === player.id
							? {
									...p,
									rules: selectedRules.map((ruleId) => ({
										id: ruleId,
									})),
									points: points,
							  }
							: p
				  )
				: [
						...prev.players,
						{
							player: { id: player.id },
							rules: selectedRules.map((ruleId) => ({
								id: ruleId,
							})),
							points: points,
						},
				  ];

			return { ...prev, players: updatedPlayers };
		});
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
					{isUpdateDay ? (
						<div className="flex flex-col gap-[16px]">
							<div className="flex items-center justify-between">
								<h2 className="body-regular break-all">
									<span className="font-semibold">
										{tempDay.name}
									</span>
								</h2>
								<button
									onClick={handleCancelUpdate}
									className="flex items-center gap-[4px] text-(--accent-normal)"
								>
									<p className="body-normal">Annulla</p>
								</button>
							</div>

							<ul className="flex flex-col gap-[12px]">
								{players.map((p) => (
									<Player
										key={p.id}
										playerObj={p}
										addPoints={true}
										dataDay={tempDay}
										handleAddPoints={handleAddPoints}
									></Player>
								))}
							</ul>
							<div className="flex flex-col gap-[8px] sticky bottom-[32px]">
								<NormalButton
									text="Conferma punteggi"
									icon={false}
									action={handleSubmit}
								/>
							</div>
							<ModalAddPoints
								isOpen={isModalAddPointsOpen}
								onClose={() => setIsModalAddPointsOpen(false)}
								playerObj={playerObj}
								dataDay={infoDay}
								onConfirm={confirmPlayerRules}
								startTabActive="Bonus"
							/>
						</div>
					) : (
						<>
							<div className="flex flex-col gap-[16px] flex-1">
								<div className="flex items-center justify-between">
									<h2 className="title-h4 font-medium break-all">
										{league.name}
									</h2>
									{isAdmin && status != "FINISHED" && (
										<button
											className="flex items-center gap-[4px] body-small font-semibold whitespace-nowrap"
											onClick={() => setIsModalOpen(true)}
										>
											Aggiungi giornata
										</button>
									)}
								</div>
								<div className="flex flex-col gap-[12px]">
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
										className="w-full"
									>
										{days.map((el, idx) => (
											<SwiperSlide key={el.id}>
												<DayTab
													day={el}
													isActive={
														idx === activeIndex
													}
													handleClick={() =>
														handleTabClick(idx)
													}
												/>
											</SwiperSlide>
										))}
									</Swiper>
									<p className="body-normal text-black text-center">
										Giocata il{" "}
										{formatDate(days[activeIndex].date)}
									</p>
								</div>
								{infoDay?.players.length > 0 ? (
									<>
										{isAdmin && status != "FINISHED" && (
											<button
												onClick={() =>
													setIsUpdateDay(true)
												}
												className="flex items-center gap-[8px] justify-center"
											>
												<p className="body-normal">
													Modifica punteggi
												</p>
												<WrenchScrewdriverIcon className="h-[20px] w-[20px]" />
											</button>
										)}
										<ul className="flex flex-col">
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
										</ul>
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
											classOpt={`self-center border border-solid text-(--error-normal) active:bg-(--error-normal) active:text-white`}
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
							</div>
						</>
					)}
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
