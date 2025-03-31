import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import DayTab from "../atoms/DayTab";
import DayPlayer from "../components/DayPlayer";
import { useLeague } from "../contexts/LeagueContext";
import NormalButton from "../atoms/Buttons/NormalButton";
import {
	PlusCircleIcon,
	PlusIcon,
	TrashIcon,
	WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import ModalCreateDay from "../components/modals/ModalCreateDay";
import Loader from "../components/Loader";
import GenericPopup from "../components/popups/GenericPopup";
import { useNavigate } from "react-router";
import GhostButton from "../atoms/Buttons/GhostButton";
import { useDay } from "../contexts/DayContext";

function Points() {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState(null);
	const { league } = useLeague();
	const { addDay, getDay, deleteDay } = useDay();
	const { days, status, isAdmin } = league;
	const [isloading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});

	const [activeDay, setActiveDay] = useState();
	const [infoDay, setInfoDay] = useState();

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
		const result = await addDay(formData);
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
		setActiveIndex(() => {
			const newIndex = result.length - 1;

			setTimeout(() => {
				if (swiperInstance) {
					swiperInstance.slideTo(newIndex);
				}
			}, 100);

			return newIndex;
		});
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
					<p className="body-normal font-semibold text-black text-center">
						Non sono ancora presenti giornate per questa lega.
					</p>
				)
			) : (
				<div className="flex flex-col gap-[16px] flex-1">
					<div className="flex flex-col gap-[12px]">
						<Swiper
							slidesPerView={3}
							spaceBetween={10}
							centeredSlides
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
										isActive={idx === activeIndex}
										handleClick={() => handleTabClick(idx)}
									/>
								</SwiperSlide>
							))}
							{isAdmin && status != "FINISHED" && (
								<SwiperSlide
									key="btnNewGiornata"
									className="flex self-center"
								>
									<button
										onClick={() => setIsModalOpen(true)}
									>
										<PlusCircleIcon className="h-6 w-6" />
									</button>
								</SwiperSlide>
							)}
						</Swiper>
						<p className="body-normal text-black text-center">
							Giocata il {formatDate(days[activeIndex].date)}
						</p>
					</div>
					{infoDay?.players.length > 0 ? (
						<>
							{isAdmin && status != "FINISHED" && (
								<button
									onClick={() =>
										navigate("setDay", {
											state: activeDay,
										})
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
								{infoDay?.players?.map((el) => (
									<DayPlayer
										key={el.id}
										playerObj={el.player}
										rules={el.rules}
										dayPoints={el.points}
									/>
								))}
							</ul>
						</>
					) : (
						<>
							<p className="body-normal text-(black-normal) font-semibold text-center">
								Punteggi di giornata non ancora inseriti
							</p>
						</>
					)}
					{isAdmin && status != "FINISHED" && (
						<div className="flex gap-[8px] mt-auto justify-center">
							<GhostButton
								text="Elimina"
								customIcon={true}
								action={handleDeleteDay}
								classOpt={`w-3/4 self-center border border-solid text-(--error-normal) active:bg-(--error-normal) active:text-white`}
							>
								<TrashIcon className="h-[20px] w-[20px] stroke-(--error-normal) group-active:stroke-white" />
							</GhostButton>
							{infoDay?.players.length == 0 && (
								<NormalButton
									text="Modifica"
									customIcon={true}
									icon={false}
									action={() =>
										navigate("setDay", {
											state: activeDay,
										})
									}
									classOpt="w-3/4"
								>
									<WrenchScrewdriverIcon className="h-[20px] w-[20px]" />
								</NormalButton>
							)}
						</div>
					)}
				</div>
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
