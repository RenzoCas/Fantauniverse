import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SidebarDesktop from "../components/SidebarDesktop";
import { useModal } from "../contexts/ModalContext";
import { useNotification } from "../contexts/NotificationContext";
import { useEffect } from "react";

export default function FantaUniverse() {
	const { isOpenBackdrop } = useModal();
    const { getNotifications } = useNotification();

    useEffect(()=>{
        getNotifications();
    }, [])

	return (
		<>
			<Navbar />
			<div
				id={`ModalBackdrop`}
				tabIndex="-1"
				aria-hidden={!isOpenBackdrop}
				className={`fixed bottom-0 left-0 w-screen h-dvh bg-(--black-normal)/50 transition-all duration-300 ease z-100 ${
					isOpenBackdrop
						? "opacity-100 visible"
						: "opacity-0 invisible delay-150"
				}`}
			></div>

			<main
				className={`flex min-h-[calc(100dvh-64px)] mx-auto py-[24px] px-[16px] bg-white lg:bg-(--black-light) lg:max-w-full lg:py-[8px] lg:px-0 lg:max-h-dvh lg:h-dvh`}
			>
				<SidebarDesktop />
				<section className="w-full lg:bg-white lg:rounded-l-[24px] lg:pb-[20px] lg:pt-[88px] lg:flex lg:flex-col relative">
					<div className="w-full lg:max-h-full md:mx-auto lg:pt-[20px] lg:px-[24px] lg:overflow-x-auto h-full">
						<Outlet />
					</div>
				</section>
			</main>
		</>
	);
}
