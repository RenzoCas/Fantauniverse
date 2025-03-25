import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import DayTab from "../atoms/DayTab";
import DayPlayer from "../components/DayPlayer";
import { useLeague } from "../contexts/LeagueContext";
import NormalButton from "../atoms/Buttons/NormalButton";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

function Points({ isAdmin }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState(null);
	const { league } = useLeague();
	const { days } = league;
	const navigate = useNavigate();

	const handleTabClick = (index) => {
		if (swiperInstance) {
			swiperInstance.slideTo(index);
		}
		setActiveIndex(index);
	};

	return (
		<>
			{days.length == 0 ? (
				<>
					{isAdmin ? (
						<>
							<p className="body-normal font-semibold text-(--black-darker) text-center">
								Sembra che tu non abbia ancora aggiunto nessuna
								giornata. Creane una da zero.
							</p>
							<NormalButton
								text="Crea una nuova giornata"
								action={() => {
									navigate("createDay");
								}}
								customIcon="true"
							>
								<PlusIcon className="h-[24px] w-[24px] text-(--black-normal) bg-white p-[4px] rounded-full" />
							</NormalButton>
						</>
					) : (
						<p className="body-normal font-semibold text-(--black-darker) text-center">
							Non sono ancora presenti giornate per questa lega.
						</p>
					)}
				</>
			) : (
				<div className="flex flex-col gap-[32px]">
					<div className="flex flex-col gap-[12px]">
						<Swiper
							slidesPerView={3}
							spaceBetween={10}
							centeredSlides={true}
							pagination={false}
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
										numDay={idx + 1}
										isActive={idx === activeIndex}
										handleClick={() => handleTabClick(idx)}
									/>
								</SwiperSlide>
							))}
						</Swiper>
						<p className="bofy-normal text-(--black-light-active) text-center">
							Giocata il {days[activeIndex].data}
						</p>
					</div>
					<ul className="flex flex-col">
						{days[activeIndex].players?.map((el) => (
							<DayPlayer key={el.id} playerObj={el} />
						))}
					</ul>
				</div>
			)}
		</>
	);
}

export default Points;
