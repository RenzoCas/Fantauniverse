import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useLeague } from "../../contexts/LeagueContext";
import GenericInput from "../../atoms/Inputs/GenericInput";
import NormalButton from "../../atoms/Buttons/NormalButton";
// import Radio from "../../atoms/Inputs/Radio";
import TabButton from "../../atoms/Buttons/TabButton";
import Switch from "../../atoms/Inputs/Switch";

function ModalLeague({ isOpen, onClose, onCreate, initialState }) {
	const [formData, setFormData] = useState(
		initialState || {
			name: "",
			description: "",
			visibility: "PUBLIC",
			coinName: "",
			maxCoins: "",
			teamMaxPlayers: "",
			enableCaptain: false,
		}
	);
	const [errors, setErrors] = useState({});
	const { createLeague, updateLeague } = useLeague();
	const [isEnableCaptain, setIsEnableCaptain] = useState(
		formData.enableCaptain
	);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "maxCoins" || name === "teamMaxPlayers") {
			if (!/^\d*$/.test(value)) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Inserisci un valore numerico",
				}));
				return;
			}

			const numericValue = Number(value);

			if (numericValue > 10000) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Il valore massimo è 10.000",
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

	const handleChangeVisibility = (value) => {
		setFormData({
			...formData,
			visibility: value,
		});
	};

	const handleChangeSwitch = () => {
		setIsEnableCaptain((prevState) => {
			const newState = !prevState;
			setFormData({ ...formData, enableCaptain: newState });
			return newState;
		});
	};

	const isFormValid = () => {
		return (
			formData.name.trim() !== "" &&
			formData.coinName.trim() !== "" &&
			formData.maxCoins !== "" &&
			formData.maxCoins > 0 &&
			formData.teamMaxPlayers > 0 &&
			!Object.values(errors).some((error) => error !== "")
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
		let result = null;
		if (initialState) {
			result = await updateLeague(formData);
		} else {
			result = await createLeague(formData);
		}
		onClose();

		if (result && !result.error) {
			onCreate(
				"success",
				`${initialState ? "Lega aggiornata!" : "Lega creata!"}`,
				`${
					initialState
						? "La lega é stata aggiornata con successo!"
						: "La lega é stata creata con successo!"
				}`
			);
			{
				!initialState &&
					setFormData({
						name: "",
						description: "",
						visibility: "PUBLIC",
						coinName: "",
						maxCoins: "",
						teamMaxPlayers: "",
						enableCaptain: false,
					});
			}
		} else {
			onCreate(
				"error",
				`${
					initialState
						? "Aggiornamento non eseguito."
						: "Creazione non eseguita."
				}`,
				`${
					initialState
						? "Errore nell'aggiornamento della lega. Riprova."
						: "Errore nella creazione della lega. Riprova."
				}`
			);
		}
	};

	return (
		<>
			<div
				id="modalLeague"
				tabIndex="-1"
				aria-hidden={!isOpen}
				className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end md:items-center transition-opacity duration-500 ease z-1000 ${
					isOpen ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
				onClick={onClose}
			></div>
			<div
				className={`fixed bottom-0 left-0 bg-white shadow-lg rounded-t-[12px] p-[16px] md:py-[24px] w-full transition-transform duration-500 ease flex flex-col gap-[4px] z-1001 max-h-[calc(100dvh-80px)] overflow-y-auto ${
					isOpen ? "translate-y-0" : "translate-y-full"
				} md:max-w-[600px] md:items-center md:justify-center`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
				</button>
				<div className="flex flex-col gap-[16px]">
					<h4 className="font-semibold text-(--black-normal)">
						{initialState ? "Aggiorna lega" : "Crea lega"}
					</h4>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-[16px] w-full"
					>
						<div className="flex flex-col gap-[8px]">
							<label
								htmlFor="name"
								className="body-small text-(--black-light-active) font-medium"
							>
								Nome lega*:
							</label>
							<GenericInput
								type="text"
								required
								name="name"
								id="name"
								messageError={errors.name}
								value={formData.name}
								handleChange={handleChange}
								handleBlur={handleBlur}
							/>
						</div>
						<div className="flex flex-col gap-[8px]">
							<label
								htmlFor="description"
								className="body-small text-(--black-light-active) font-medium"
							>
								Descrizione:
							</label>
							<GenericInput
								type="textarea"
								name="description"
								id="description"
								messageError={errors.description}
								value={formData.description}
								handleChange={handleChange}
							/>
						</div>

						<div className="flex flex-col gap-[16px] md:flex-row">
							<div className="flex flex-col gap-[8px]">
								<label
									htmlFor="coinName"
									className="body-small text-(--black-light-active) font-medium"
								>
									Nome della moneta*:
								</label>
								<GenericInput
									type="text"
									required
									name="coinName"
									id="coinName"
									messageError={errors.coinName}
									value={formData.coinName}
									handleChange={handleChange}
									handleBlur={handleBlur}
								/>
							</div>
							<div className="flex flex-col gap-[8px]">
								<label
									htmlFor="maxCoins"
									className="body-small text-(--black-light-active) font-medium"
								>
									Budget*:
								</label>
								<GenericInput
									type="text"
									required
									name="maxCoins"
									id="maxCoins"
									messageError={errors.maxCoins}
									value={formData.maxCoins}
									handleChange={handleChange}
									handleBlur={handleBlur}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-[8px]">
							<label
								htmlFor="teamMaxPlayers"
								className="body-normal text-(--black-light-active) font-medium"
							>
								Numero di player del team*:
							</label>
							<GenericInput
								type="text"
								required
								name="teamMaxPlayers"
								id="teamMaxPlayers"
								messageError={errors.teamMaxPlayers}
								value={formData.teamMaxPlayers}
								handleChange={handleChange}
								handleBlur={handleBlur}
							/>
						</div>
						<div className="flex flex-col gap-[8px]">
							<p className="body-normal text-(--black-light-active) font-medium">
								Capitano:
							</p>
							<Switch
								text="Attiva la scelta del capitano alla
                                                                creazione della squadra."
								enabled={isEnableCaptain}
								onChange={handleChangeSwitch}
							/>
						</div>
						<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-normal)">
							<TabButton
								handleClick={() =>
									handleChangeVisibility("PUBLIC")
								}
								active={formData.visibility === "PUBLIC"}
							>
								<p className="body-normal">Pubblica</p>
							</TabButton>
							<TabButton
								handleClick={() =>
									handleChangeVisibility("PRIVATE")
								}
								active={formData.visibility === "PRIVATE"}
							>
								<p className="body-normal">Privata</p>
							</TabButton>
						</div>
						<NormalButton
							text={initialState ? "Aggiorna lega" : "Crea lega"}
							action={handleSubmit}
							disabled={!isFormValid()}
						/>
					</form>
				</div>
			</div>
		</>
	);
}

export default ModalLeague;
