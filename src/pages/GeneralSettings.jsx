import { useState } from "react";
import { useLeague } from "../contexts/LeagueContext";
import Select from "../atoms/Inputs/Select";
import {
	CheckIcon,
	ClipboardIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";
import GhostButton from "../atoms/Buttons/GhostButton";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";
import GenericInput from "../atoms/Inputs/GenericInput";
import ModalConfirmAction from "../components/modals/ModalConfirmAction";
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
		players,
		rules,
		participants,
		days,
		code,
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
	const [isModalConfirmOpen, setIsModalConfirmOpen] = useState({
		action: null,
		value: false,
	});
	const [textModal, setTextModal] = useState();
	const [disclaimerModal, setDisclaimerModal] = useState();
	const [isDisabled, setIsDisabled] = useState(false);
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
		},
		{
			value: "STARTED",
			text: "Avviata",
		},
		{
			value: "FINISHED",
			text: "Terminata",
		},
	];

	const currentIndex = options.findIndex(
		(opt) => opt.value === selectedValue
	);

	const filteredOptions =
		currentIndex !== -1 ? options.slice(currentIndex) : options;

	const isEditingAnyField = Object.values(isEditing).some(
		(isEditing) => isEditing
	);

	const showModalConfirmChange = (value) => {
		if (value === selectedValue) return;
		setTempValue(value);

		switch (value) {
			case "NOT_STARTED": {
				const isDisabled = players.length === 0 || rules.length === 0;
				setIsDisabled(isDisabled);
				if (isDisabled) {
					setTextModal("Attenzione!");
					setDisclaimerModal(
						"Per poter pubblicare la lega deve esserci almeno 1 giocatore ed almeno 1 regola."
					);
				} else {
					setTextModal("Sei sicuro di voler pubblicare la lega?");
					setDisclaimerModal(
						"Confermando non sará piú possibile modificare i dati della lega, i player e il regolamento."
					);
				}

				break;
			}
			case "STARTED": {
				const isDisabled = participants.length <= 1;
				setIsDisabled(isDisabled);
				if (isDisabled) {
					setTextModal("Attenzione!");
					setDisclaimerModal(
						"Per poter avviare la lega deve essere pubblicata e devono esserci almeno 2 partecipanti iscritti."
					);
				} else {
					setTextModal("Sei sicuro di voler avviare la lega?");
					setDisclaimerModal(
						"Confermando non sará piú possibile iscriversi alla lega."
					);
				}
				break;
			}
			case "FINISHED": {
				const isDisabled = days.length === 0;
				setIsDisabled(isDisabled);
				if (isDisabled) {
					setTextModal("Attenzione!");
					setDisclaimerModal(
						"Per poter terminare la lega deve essere avviata ed esserci almeno 1 giornata."
					);
				} else {
					setTextModal("Sei sicuro di voler terminare la lega?");
					setDisclaimerModal(null);
				}
				break;
			}

			default:
				break;
		}
		setIsModalConfirmOpen({ action: "select", value: true });
	};

	const showModalConfirmDelete = () => {
		setTextModal("Sei sicuro di voler eliminare la lega?");
		setDisclaimerModal(
			"Confermando non sará piú possibile accedere ai dati di questa lega."
		);
		setIsModalConfirmOpen({ action: "delete", value: true });
	};

	const handleChangeSelect = async () => {
		setSelectedValue(tempValue);
		setIsModalConfirmOpen({ action: "select", value: false });
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
		setIsEditing((prev) => ({
			...Object.keys(prev).reduce((acc, key) => {
				acc[key] = key === field ? !prev[key] : false;
				return acc;
			}, {}),
		}));
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

		navigate(`/app`, {
			state: { deleteLeague: result ? true : false },
			replace: true,
		});

		setIsLoading(false);
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

	const handleCopy = () => {
		navigator.clipboard
			.writeText(code)
			.then(() =>
				showPopup(
					"success",
					"Codice copiato!",
					"Il codice é stato copiato correttamente. Condividilo con i tuoi amici."
				)
			)
			.catch(() =>
				showPopup(
					"success",
					"Codice non copiato!",
					"Il codice non é stato copiato. Riprova."
				)
			);
	};

	return (
		<>
			{isLoading && <Loader />}
			<div className="flex flex-col items-between gap-[40px] flex-1">
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
											autoFocus={true}
										/>
									) : (
										<p className="body-normal break-words">
											{formData[field]}
										</p>
									)}
								</div>
							))}
						</>
					)}
					{status == "NOT_STARTED" && (
						<div className="flex flex-col gap-[4px]">
							<p className="body-small font-semibold">
								Condividi il codice della lega con i tuoi amici:
							</p>
							<div className="flex items-center gap-2">
								<button
									onClick={handleCopy}
									className="hover:bg-gray-300"
								>
									<ClipboardIcon className="h-5 w-5 text-gray-600" />
								</button>
								<p className="font-mono bg-gray-100 p-2 rounded break-words">
									{code}
								</p>
							</div>
						</div>
					)}
				</div>
				{status === "PENDING" && (
					<div className="flex flex-col gap-[8px] w-full mt-auto">
						<NormalButton
							text="Salva"
							action={() => handleUpdateLeague(null)}
							disabled={!isFormValid() || isEditingAnyField}
						/>
						<GhostButton
							text="Elimina lega"
							action={showModalConfirmDelete}
							classOpt="text-(--error-normal)"
							disabled={isEditingAnyField}
						>
							<TrashIcon className="w-[24px] h-[24px]" />
						</GhostButton>
					</div>
				)}
				<ModalConfirmAction
					isOpen={isModalConfirmOpen.value}
					text={textModal}
					disclaimer={disclaimerModal}
					onClose={() =>
						setIsModalConfirmOpen({ action: null, value: false })
					}
					onConfirmAction={
						isModalConfirmOpen.action == "select"
							? handleChangeSelect
							: handleDeleteLeague
					}
					isDisabled={isDisabled}
				></ModalConfirmAction>
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
