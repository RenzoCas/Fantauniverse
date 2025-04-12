import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useLeague } from "../../contexts/LeagueContext";
import GenericInput from "../../atoms/Inputs/GenericInput";
import { useModal } from "../../contexts/ModalContext";
import League from "../League";
import { useInView } from "react-intersection-observer";

function ModalSearchLeague({ isOpen, onClose, onAddParticipant }) {
	const { searchLeague } = useLeague();
	const { openBackdrop, closeBackdrop } = useModal();

	const [formData, setFormData] = useState({ leagueName: "" });
	const [leagues, setLeagues] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const isLoadingRef = useRef(false);

	const { ref: loadMoreRef, inView } = useInView({
		rootMargin: "1000px",
	});

	useEffect(() => {
		if (isOpen) {
			openBackdrop();
		} else {
			closeBackdrop();
		}
	}, [isOpen]);

	useEffect(() => {
		resetAndLoad();
	}, [formData.leagueName, isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		if (inView && hasMore && !isLoadingRef.current) {
			loadLeagues(offset + 1, true);
		}
	}, [inView]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const resetAndLoad = () => {
		setLeagues([]);
		setOffset(0);
		setHasMore(true);
		loadLeagues(0, false);
	};

	const loadLeagues = async (offsetToUse, append) => {
		if (isLoadingRef.current || !hasMore) return;
		isLoadingRef.current = true;

		try {
			const result = await searchLeague({
				nameOrCode: formData.leagueName,
				status: ["NOT_STARTED", "STARTED", "FINISHED"],
				pagination: { offset: offsetToUse, limit: 6 },
			});

			const newLeagues = result?.leagues || [];

			if (newLeagues.length < 6) {
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
			className={`fixed h-screen bottom-0 left-0 bg-white shadow-lg w-full transition-all duration-300 ease flex flex-col gap-[16px] z-1001 overflow-y-auto lg:rounded-none ${
				isOpen
					? "scale-100 opacity-100 translate-y-0 lg:bottom-1/2 lg:translate-y-1/2 visible"
					: "scale-80 opacity-30 translate-y-full lg:translate-y-0 invisible"
			}`}
		>
			<div className="flex flex-col gap-[16px] w-full sticky top-0 bg-white p-[16px] lg:pt-[24px] z-10 lg:max-w-[600px] lg:mx-auto">
				<div className="flex items-center justify-between gap-[8px] w-full">
					<h4 className="font-semibold text-(--black-normal)">
						Leghe:
					</h4>
					<button onClick={onClose} className="cursor-pointer">
						<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
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

			<ul className="flex flex-col gap-[10px] px-[16px] pb-[16px] w-full lg:max-w-[600px] lg:mx-auto">
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
					<p className="text-center py-4 text-(--black-normal) font-semibold">
						Caricamento...
					</p>
				)}
				{!hasMore && (
					<p className="text-center py-4 text-(--black-normal) font-semibold">
						Non ci sono più leghe
					</p>
				)}
			</ul>
		</div>
	);
}

export default ModalSearchLeague;
