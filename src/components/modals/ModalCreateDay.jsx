import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import GenericInput from "../../atoms/Inputs/GenericInput";
import NormalButton from "../../atoms/Buttons/NormalButton";
import { useLeague } from "../../contexts/LeagueContext";

function ModalCreateDay({ isOpen, onClose, handleSubmit }) {
	const { league } = useLeague();
	const [formData, setFormData] = useState({
		days: [{ name: "", date: new Date().toISOString().split("T")[0] }],
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			days: [{ ...formData.days[0], [name]: value }],
		});
	};

	const isFormValid = () => formData.days[0].name.trim() !== "";

	return (
		<>
			<div
				className={`fixed bottom-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-end md:items-center transition-opacity duration-500 ease z-1000 ${
					isOpen ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
				onClick={onClose}
			></div>
			<div
				className={`fixed bottom-0 left-0 bg-white shadow-lg rounded-t-xl p-4 md:py-6 w-full h-fit transition-transform duration-500 ease flex flex-col gap-2 md:max-w-lg z-1001 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
				</button>
				<h4 className="font-semibold text-black">Crea giornata</h4>
				<form className="flex flex-col gap-[16px] w-full">
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
						action={(e) => {
							e.preventDefault();
							setFormData({
								leagueId: league.id,
								days: [
									{
										name: "",
										date: new Date()
											.toISOString()
											.split("T")[0],
									},
								],
							});
							handleSubmit(formData);
						}}
						disabled={!isFormValid()}
					/>
				</form>
			</div>
		</>
	);
}

export default ModalCreateDay;
