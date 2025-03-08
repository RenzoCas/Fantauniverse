import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useLeague } from "../../contexts/LeagueContext";
import NormalButton from "../../atoms/Buttons/NormalButton";
import GenericInput from "../../atoms/Inputs/GenericInput";

function ModalAddPlayer({ isOpen, onClose }) {
	const [formData, setFormData] = useState({
		name: "",
		price: "",
	});
	const [errors, setErrors] = useState({});
	const [isSuccess, setIsSuccess] = useState(null);
	const [resultText, setResultText] = useState();
	const { addPlayer } = useLeague();

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "price") {
			if (!/^\d*$/.test(value)) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Inserisci un valore numerico",
				}));
				return;
			}

			const numericValue = Number(value);
			if (numericValue > 100) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Il valore massimo è 100",
				}));
				return;
			} else {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "",
				}));
			}

			setFormData({
				...formData,
				[name]: numericValue,
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const isFormValid = () => {
		return (
			formData.name.trim() !== "" &&
			formData.price !== "" &&
			formData.price > 0
		);
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: value.trim() ? "" : "Campo obbligatorio",
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newPlayer = await addPlayer(formData);

		if (newPlayer) {
			setResultText("Player aggiunto con successo.");
			setIsSuccess(true);
		} else {
			setResultText("Errore nell'aggiunta del player.");
			setIsSuccess(false);
		}
	};

	return (
		<div
			id="ModalAddPlayer"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-end transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-t-lg p-4 w-full transition-transform duration-500 ease flex flex-col gap-6 z-100 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-5 w-5" />
				</button>
				{isSuccess === true ? (
					<>
						<p className="text-black font-semibold">{resultText}</p>
						<NormalButton
							text="Chiudi"
							action={() => {
								onClose();
								setIsSuccess(null);
								setFormData({
									name: "",
									price: "",
								});
							}}
						/>
					</>
				) : isSuccess === false ? (
					<>
						<p className="text-red-500 font-semibold">
							{resultText}
						</p>
						<NormalButton
							text="Riprova"
							action={() => setIsSuccess(null)}
						/>
					</>
				) : (
					<>
						<h4 className="font-semibold text-black">
							Aggiungi il tuo player
						</h4>
						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-4"
						>
							<GenericInput
								type="text"
								required
								name="name"
								id="name"
								placeholder="Nome player"
								messageError={errors.name}
								value={formData.name}
								handleChange={handleChange}
								handleBlur={handleBlur}
							/>
							<GenericInput
								type="text"
								required
								name="price"
								id="price"
								placeholder="Valore player"
								messageError={errors.price}
								value={formData.price}
								handleChange={handleChange}
								handleBlur={handleBlur}
							/>
							<NormalButton
								text="Aggiungi Player"
								action={handleSubmit}
								disabled={!isFormValid()}
							/>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

export default ModalAddPlayer;
