import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import DayTab from "../atoms/DayTab";
import DayPlayer from "../components/DayPlayer";
import { useLeague } from "../contexts/LeagueContext";
import NormalButton from "../atoms/Buttons/NormalButton";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import ModalCreateDay from "../components/modals/ModalCreateDay";
import Loader from "../components/Loader";
import GenericPopup from "../components/popups/GenericPopup";
import { useNavigate } from "react-router";

function Points({ isAdmin }) {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState(null);
	const { league, createDay, getLeague } = useLeague();
	const { id, days } = league;
	const [isloading, setIsLoading] = useState(false);
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});

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
		const result = await createDay(formData);
		await getLeague(id);
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
	};

	return (
		<>
			{isloading && <Loader />}
			{days.length === 0 ? (
				isAdmin ? (
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
				<div className="flex flex-col gap-[12px]">
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
							{isAdmin && (
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
					{days[activeIndex].players ? (
						<>
							<ul className="flex flex-col">
								{days[activeIndex].players?.map((el) => (
									<DayPlayer key={el.id} playerObj={el} />
								))}
							</ul>
						</>
					) : (
						<>
							<p className="body-normal text-black text-center">
								Punteggi di giornata non ancora inseriti
							</p>
							{isAdmin && (
								<NormalButton
									text="Modifica giornata"
									icon={false}
									action={() => navigate("setDay")}
								/>
							)}
						</>
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
