import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useLeague } from "../../contexts/LeagueContext";
import GenericInput from "../../atoms/Inputs/GenericInput";
import { useModal } from "../../contexts/ModalContext";
import League from "../League";
import { useInView } from "react-intersection-observer";
import FocusModal from "../../hooks/FocusModal";

function ModalSearchLeague({ isOpen, onClose, onAddParticipant }) {
	const { searchLeague } = useLeague();
	const { openBackdrop, closeBackdrop } = useModal();

	const [formData, setFormData] = useState({ leagueName: "" });
	const [leagues, setLeagues] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const isLoadingRef = useRef(false);

	const { ref: loadMoreRef, inView } = useInView({ rootMargin: "1000px" });
	const modalRef = useRef(null);
	FocusModal(modalRef, isOpen);

	useEffect(() => {
		isOpen ? openBackdrop() : closeBackdrop();
	}, [isOpen]);

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

	useEffect(() => {
		if (isOpen) {
			resetAndLoad();
		}
	}, [formData.leagueName, isOpen]);

	useEffect(() => {
		if (!isOpen || !inView || isLoadingRef.current || !hasMore) return;
		loadLeagues(offset + 1, true);
	}, [inView]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const resetAndLoad = () => {
		setOffset(0);
		setHasMore(true);
		loadLeagues(0, false);
	};

	const loadLeagues = async (offsetToUse, append) => {
		if (isLoadingRef.current) return;
		isLoadingRef.current = true;

		try {
			const result = await searchLeague({
				nameOrCode: formData.leagueName,
				status: ["NOT_STARTED", "STARTED", "FINISHED"],
				pagination: { offset: offsetToUse, limit: 10 },
				visibility: formData.leagueName === "" ? ["PUBLIC"] : [],
			});

			const newLeagues = result?.leagues || [];

			if (newLeagues.length < 10) {
				setHasMore(false);
			}

			setLeagues((prev) =>
				append ? [...prev, ...newLeagues] : newLeagues
			);
			setOffset(offsetToUse);
		} finally {
			isLoadingRef.current = false;
		}
	};

	return (
		<div
			ref={modalRef}
			role="dialog"
			aria-modal="true"
			tabIndex="-1"
			className={`fixed h-dvh bottom-0 left-0 bg-white shadow-lg w-full transition-all duration-300 ease flex flex-col gap-4 z-1001 overflow-y-auto lg:rounded-none ${
				isOpen
					? "scale-100 opacity-100 translate-y-0 lg:bottom-1/2 lg:translate-y-1/2 visible"
					: "scale-80 opacity-30 translate-y-full lg:translate-y-0 invisible"
			}`}
		>
			<div className="flex flex-col gap-4 w-full sticky top-0 bg-white p-4 lg:pt-6 z-10 lg:max-w-[600px] lg:mx-auto">
				<div className="flex items-center justify-between w-full">
					<h4 className="font-semibold text-black">Leghe:</h4>
					<button onClick={onClose} className="cursor-pointer">
						<XMarkIcon className="h-6 w-6" />
					</button>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						resetAndLoad();
					}}
					className="w-full"
				>
					<GenericInput
						type="text"
						name="leagueName"
						id="searchLeague"
						placeholder="Cerca una lega a cui iscriverti"
						value={formData.leagueName}
						handleChange={handleChange}
					/>
				</form>
			</div>

			<ul className="flex flex-col gap-2 px-4 pb-4 w-full lg:max-w-[600px] lg:mx-auto">
				{leagues.map((item) => (
					<League
						key={item.id}
						league={item}
						onAddParticipant={onAddParticipant}
						classOpt="lg:w-full lg:max-w-none"
					/>
				))}

				{hasMore && <div ref={loadMoreRef} />}

				{isLoadingRef.current && (
					<p className="text-center py-4 text-black font-semibold">
						Caricamento...
					</p>
				)}

				{!hasMore && leagues.length > 0 && (
					<p className="text-center py-4 text-black font-semibold">
						Non sono presenti altre leghe
					</p>
				)}
			</ul>
		</div>
	);
}

export default ModalSearchLeague;
