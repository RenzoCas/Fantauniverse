import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import GenericInput from "../../atoms/Inputs/GenericInput";
import NormalButton from "../../atoms/Buttons/NormalButton";
import { useLeague } from "../../contexts/LeagueContext";
import { useModal } from "../../contexts/ModalContext";

function ModalCreateDay({ isOpen, onClose, handleSubmit }) {
	const { league } = useLeague();
	const [formData, setFormData] = useState({
		leagueId: league.id,
		days: [{ name: "", date: new Date().toISOString().split("T")[0] }],
	});
	const { openBackdrop, closeBackdrop } = useModal();

	useEffect(() => {
		if (isOpen) {
			openBackdrop();
		} else {
			closeBackdrop();
		}
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			days: [{ ...formData.days[0], [name]: value }],
		});
	};

	const isFormValid = () => formData.days[0].name.trim() !== "";

	const handleSubmitData = () => {
		setFormData({
			leagueId: league.id,
			days: [
				{
					name: "",
					date: new Date().toISOString().split("T")[0],
				},
			],
		});
		handleSubmit(formData);
	};

	return (
		<>
			<div
				className={`fixed bottom-0 left-0 bg-white shadow-lg rounded-t-[12px] p-[16px] lg:p-[24px] w-full transition-all duration-300 ease flex flex-col gap-[16px] z-1001 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:rounded-[12px] lg:max-w-[500px] ${
					isOpen
						? "scale-100 opacity-100 translate-y-0 lg:bottom-1/2 lg:translate-y-1/2 visible"
						: "scale-80 opacity-30 translate-y-full lg:translate-y-0 invisible"
				}`}
			>
				<div className="flex items-center justify-between gap-[8px]">
					<h4 className="body-normal font-semibold">Crea giornata</h4>
					<button onClick={onClose} className="cursor-pointer">
						<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
					</button>
				</div>

				<form
					className="flex flex-col gap-[16px] w-full"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmitData();
					}}
				>
					<input
						type="date"
						name="date"
						value={formData.days[0].date}
						onChange={handleChange}
						className="py-[8px] px-[16px] border border-solid rounded-lg w-full"
					/>
					<GenericInput
						type="text"
						required
						name="name"
						placeholder="Nome giornata"
						value={formData.days[0].name}
						handleChange={handleChange}
					/>
					<NormalButton
						text="Conferma"
						action={handleSubmitData}
						disabled={!isFormValid()}
					/>
				</form>
			</div>
		</>
	);
}

export default ModalCreateDay;
