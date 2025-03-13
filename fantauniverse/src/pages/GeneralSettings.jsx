import { useState } from "react";
import { useLeague } from "../contexts/LeagueContext";
import Select from "../atoms/Inputs/Select";
import {
	CheckIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";
import GhostButton from "../atoms/Buttons/GhostButton";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";
import GenericInput from "../atoms/Inputs/GenericInput";
import MdalConfirmAction from "../components/modals/ModalConfirmAction";
import GenericPopup from "../components/popups/GenericPopup";

function GeneralSettings() {
	const { league, getLeague, deleteLeague, updateLeague } = useLeague();
	const {
		id,
		name,
		description,
		coinName,
		maxCoins,
		status,
		leagueInfoCompleted,
		participants,
		days,
	} = league;
	const [selectedValue, setSelectedValue] = useState(status);
	const [tempValue, setTempValue] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [isEditing, setIsEditing] = useState({
		name: false,
		description: false,
		coinName: false,
		maxCoins: false,
	});
	const [formData, setFormData] = useState({
		id: id,
		name: name || "",
		description: description || "",
		coinName: coinName || "",
		maxCoins: maxCoins || 0,
	});
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		title: "",
		message: "",
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [textModal, setTextModal] = useState();
	const [disclaimerModal, setDisclaimerModal] = useState();
	const navigate = useNavigate();

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const options = [
		{ value: "PENDING", text: "Non pubblicata" },
		{
			value: "NOT_STARTED",
			text: "Pubblicata",
			isDisabled: !leagueInfoCompleted,
		},
		{
			value: "STARTED",
			text: "Avviata",
			isDisabled: participants.length == 0,
		},
		{
			value: "FINISHED",
			text: "Terminata",
			isDisabled: days.length == 0,
		},
	];

	const currentIndex = options.findIndex(
		(opt) => opt.value === league.status
	);
	const filteredOptions = options.slice(currentIndex, currentIndex + 2);
	const isEditingAnyField = Object.values(isEditing).some(
		(isEditing) => isEditing
	);

	const showModalConfirmChange = (value) => {
		if (value === selectedValue) return;
		setTempValue(value);

		switch (value) {
			case "NOT_STARTED":
				setTextModal("Sei sicuro di voler pubblicare la lega?");
				setDisclaimerModal(
					"Confermando non sará piú possibile modificare i dati della lega, i player e il regolamento."
				);
				break;
			case "STARTED":
				setTextModal("Sei sicuro di voler avviare la lega?");
				setDisclaimerModal(
					"Confermando non sará piú possibile iscriversi alla lega."
				);
				break;
			case "FINISHED":
				setTextModal("Sei sicuro di voler terminare la lega?");
				setDisclaimerModal(null);
				break;
			default:
				break;
		}
		setIsModalOpen(true);
	};

	const handleChangeSelect = async () => {
		setSelectedValue(tempValue);
		setIsModalOpen(false);
		setIsLoading(true);
		await handleUpdateLeague(tempValue);
		setIsLoading(false);
	};

	const handleChangeData = (e) => {
		const { name, value } = e.target;
		if (name === "maxCoins") {
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
				setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
			}
			setFormData({ ...formData, [name]: numericValue });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: value.trim() ? "" : "Campo obbligatorio",
		}));
	};

	const toggleEditing = (field) => {
		if (status !== "PENDING" || (isEditing[field] && errors[field])) return;
		setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const handleUpdateLeague = async (newStatus = status) => {
		if (!isFormValid(newStatus)) return;
		setIsLoading(true);

		const result = await updateLeague({
			...formData,
			status: newStatus ? newStatus : status,
		});
		await getLeague(id);

		setIsLoading(false);

		if (!result) {
			showPopup(
				"error",
				"Errore nella modifica della lega",
				"La lega non é stata modificata correttamente. Riprova."
			);
			setFormData({
				name: name,
				description: description,
				coinName: coinName,
				maxCoins: maxCoins,
			});
			return;
		}
		showPopup(
			"success",
			"Lega modificata.",
			"La lega é stata modificata correttamente."
		);
	};

	const handleDeleteLeague = async () => {
		setIsLoading(true);
		const result = await deleteLeague(id);
		setIsLoading(false);
		if (!result) {
			showPopup(
				"error",
				"Errore nell'eliminazione della lega",
				"La lega non é stata eliminata correttamente. Riprova."
			);
			return;
		}
		showPopup(
			"success",
			"Lega eliminata.",
			"La lega é stata eliminata correttamente."
		);
		setTimeout(() => {
			navigate("/app");
		}, 2000);
	};

	const isFormValid = (newStatus = selectedValue) => {
		return (
			!Object.values(errors).some((error) => error !== "") &&
			(formData.name.trim() !== name ||
				formData.description.trim() !== description ||
				formData.coinName.trim() !== coinName ||
				formData.maxCoins !== maxCoins ||
				newStatus !== status)
		);
	};

	return (
		<>
			{isLoading && <Loader />}
			<div className="flex flex-col items-between gap-[40px]">
				<div className="flex flex-col gap-[16px]">
					<Select
						options={filteredOptions}
						selectedValue={selectedValue}
						handleChange={showModalConfirmChange}
					/>
					{status == "PENDING" && (
						<>
							{[
								"name",
								"description",
								"coinName",
								"maxCoins",
							].map((field) => (
								<div
									key={field}
									className="flex gap-[10px] items-center px-[10px]"
								>
									<button
										className="p-[10px] bg-(--black-light) rounded-full max-h-fit"
										onClick={() => toggleEditing(field)}
										disabled={status !== "PENDING"}
									>
										{isEditing[field] ? (
											<CheckIcon className="h-[20px] w-[20px]" />
										) : (
											<PencilSquareIcon className="h-[20px] w-[20px]" />
										)}
									</button>
									{isEditing[field] ? (
										<GenericInput
											type={
												field === "description"
													? "textarea"
													: "text"
											}
											required
											placeholder={`Inserisci ${field}`}
											name={field}
											value={formData[field]}
											handleChange={handleChangeData}
											handleBlur={handleBlur}
											messageError={errors[field]}
										/>
									) : (
										<p className="body-normal">
											{formData[field]}
										</p>
									)}
								</div>
							))}
						</>
					)}
				</div>
				{status === "PENDING" && (
					<div className="flex flex-col gap-[8px] w-full">
						<NormalButton
							text="Salva"
							action={() => handleUpdateLeague(null)}
							disabled={!isFormValid() || isEditingAnyField}
						/>
						<GhostButton
							text="Elimina lega"
							action={handleDeleteLeague}
							classOpt="text-(--error-normal)"
							disabled={isEditingAnyField}
						>
							<TrashIcon className="w-[24px] h-[24px]" />
						</GhostButton>
					</div>
				)}
				<MdalConfirmAction
					isOpen={isModalOpen}
					text={textModal}
					disclaimer={disclaimerModal}
					onClose={() => setIsModalOpen(false)}
					onConfirmAction={handleChangeSelect}
				></MdalConfirmAction>
				<GenericPopup
					isOpen={popupData.isOpen}
					type={popupData.type}
					title={popupData.title}
					message={popupData.message}
				/>
			</div>
		</>
	);
}

export default GeneralSettings;
