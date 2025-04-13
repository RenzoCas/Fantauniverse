import { useState } from "react";
import { useLeague } from "../contexts/LeagueContext";
import Select from "../atoms/Inputs/Select";
import {
	PencilSquareIcon,
	TrashIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";
import GhostButton from "../atoms/Buttons/GhostButton";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";
import GenericInput from "../atoms/Inputs/GenericInput";
import ModalConfirmAction from "../components/modals/ModalConfirmAction";
import GenericPopup from "../components/popups/GenericPopup";
import Switch from "../atoms/Inputs/Switch";
import TabButton from "../atoms/Buttons/TabButton";
import FixedPopup from "../components/popups/FixedPopup";
import { Clipboard, Coins, PiggyBank, Save, Sparkles } from "lucide-react";
import Rules from "./Rules";
import { useParticipant } from "../contexts/ParticipantContext";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Players from "./Players";

function GeneralSettings() {
	const { league, deleteLeague, updateLeague, changeStatus } = useLeague();
	const {
		id,
		name,
		description,
		coinName,
		maxCoins,
		visibility,
		status,
		players,
		rules,
		participants,
		days,
		code,
		teamMaxPlayers,
		enableCaptain,
		isAdmin,
		isRegistered,
	} = league;
	const [selectedValue, setSelectedValue] = useState(status);
	const [tempValue, setTempValue] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const { addParticipant } = useParticipant();
	const [isEditing, setIsEditing] = useState({
		name: false,
		description: false,
		coinName: false,
		maxCoins: false,
		teamMaxPlayers: false,
	});
	const [formData, setFormData] = useState({
		id: id,
		name: name || "",
		description: description || null,
		coinName: coinName || "",
		maxCoins: maxCoins || 0,
		visibility: visibility || "PUBLIC",
		teamMaxPlayers: teamMaxPlayers || 0,
		enableCaptain: enableCaptain || false,
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

	const [dataModalConfirm, setDataModalConfirm] = useState({
		title: "",
		text: "",
		conferma: "",
		annulla: "",
	});

	const [isEnableCaptain, setIsEnableCaptain] = useState(enableCaptain);
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
		if (isFormValid()) {
			showPopup(
				"alert",
				"Attenzione!",
				"Prima di cambiare stato della lega devi salvare le modifiche in corso."
			);
		} else {
			setTempValue(value);
			switch (value) {
				case "NOT_STARTED": {
					const isDisabled =
						players.length === 0 || rules.length === 0;
					if (isDisabled) {
						showPopup(
							"alert",
							"Attenzione!",
							"Per poter pubblicare la lega deve esserci almeno 1 giocatore ed almeno 1 regola."
						);
					} else {
						setDataModalConfirm({
							title: "Pubblica lega",
							text: "Confermando non sará piú possibile modificare le impostazioni della lega.",
							conferma: "Conferma",
							annulla: "Annulla",
						});
						setIsModalConfirmOpen({
							action: "select",
							value: true,
						});
					}

					break;
				}
				case "STARTED": {
					const isDisabled = participants.length <= 1;
					if (isDisabled) {
						showPopup(
							"alert",
							"Attenzione!",
							"Per poter avviare la lega deve essere pubblicata e devono esserci almeno 2 partecipanti iscritti."
						);
					} else {
						setDataModalConfirm({
							title: "Avvia lega",
							text: "Confermando non sará piú possibile iscriversi alla lega.",
							conferma: "Conferma",
							annulla: "Annulla",
						});
						setIsModalConfirmOpen({
							action: "select",
							value: true,
						});
					}
					break;
				}
				case "FINISHED": {
					const isDisabled = days.length === 0;
					if (isDisabled) {
						showPopup(
							"alert",
							"Attenzione!",
							"Per poter terminare la lega deve essere avviata ed esserci almeno 1 giornata."
						);
					} else {
						setDataModalConfirm({
							title: "Termina lega",
							text: "Confermando la lega terminerá e non sará possibile aggiungere nuove giornate.",
							conferma: "Conferma",
							annulla: "Annulla",
						});
						setIsModalConfirmOpen({
							action: "select",
							value: true,
						});
					}
					break;
				}

				default:
					break;
			}
		}
	};

	const showModalConfirmDelete = () => {
		setDataModalConfirm({
			title: "Elimina lega",
			text: "Confermando non sará piú possibile accedere ai dati di questa lega.",
			conferma: "Conferma",
			annulla: "Annulla",
		});
		setIsModalConfirmOpen({ action: "delete", value: true });
	};

	const handleChangeSelect = async () => {
		setSelectedValue(tempValue);
		setIsModalConfirmOpen({ action: "select", value: false });
		setIsLoading(true);
		await changeStatus(tempValue);
		setIsLoading(false);
	};

	const handleChangeData = (e) => {
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
				setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
			}
			setFormData({ ...formData, [name]: numericValue });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleChangeSwitch = () => {
		setIsEnableCaptain((prevState) => {
			const newState = !prevState;
			setFormData({ ...formData, enableCaptain: newState });
			return newState;
		});
	};

	const handleTabChange = (value) => {
		setFormData({ ...formData, visibility: value });
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

	const handleUpdateLeague = async () => {
		if (!isFormValid()) return;
		setIsLoading(true);

		const result = await updateLeague(formData);
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

	const isFormValid = () => {
		return (
			!Object.values(errors).some((error) => error !== "") &&
			(formData.name.trim() !== name ||
				(formData.description != null &&
					formData.description.trim() !== description) ||
				formData.coinName.trim() !== coinName ||
				formData.maxCoins !== maxCoins ||
				formData.visibility != visibility ||
				formData.teamMaxPlayers != teamMaxPlayers ||
				formData.enableCaptain != enableCaptain)
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

	const handleAddParticipant = async () => {
		setIsLoading(true);
		const res = await addParticipant(id);
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore nell'iscrizione alla lega!",
				"L'iscrizione a questa lega non é andata a buon fine. Riprova."
			);
			return;
		}
		setIsLoading(false);
		showPopup(
			"success",
			"Iscrizione effettuata!",
			"L'iscrizione a questa lega é andata a buon fine."
		);
	};

	const [tabActive, setTabActive] = useState("Info");

	return (
		<>
			{isLoading && <Loader />}
			<div className="flex flex-col gap-[12px] flex-1">
				{status === "PENDING" ? (
					<>
						<Select
							options={filteredOptions}
							selectedValue={selectedValue}
							handleChange={showModalConfirmChange}
						/>
						<div className="flex flex-col gap-[8px]">
							<div className="flex gap-[10px]">
								<button
									className="p-[10px] bg-(--black-light) rounded-full max-h-fit cursor-pointer"
									onClick={() => toggleEditing("name")}
									disabled={status !== "PENDING"}
								>
									{isEditing.name ? (
										<Save className="h-[20px] w-[20px]" />
									) : (
										<PencilSquareIcon className="h-[20px] w-[20px]" />
									)}
								</button>
								{isEditing.name ? (
									<GenericInput
										type="text"
										required
										placeholder={`Inserisci nome`}
										name="name"
										value={formData.name}
										handleChange={handleChangeData}
										handleBlur={handleBlur}
										messageError={errors.name}
										autoFocus={true}
										maxLength={30}
									/>
								) : (
									<p
										className={`break-all self-center body-regular font-medium `}
									>
										{formData.name}
									</p>
								)}
							</div>

							{description && (
								<>
									<label
										htmlFor="description"
										className="body-normal text-(--black-light-active) font-medium"
									>
										Descrizione:
									</label>
									<div className="flex gap-[10px]">
										<button
											className="p-[10px] bg-(--black-light) rounded-full max-h-fit cursor-pointer"
											onClick={() =>
												toggleEditing("description")
											}
											disabled={status !== "PENDING"}
										>
											{isEditing.description ? (
												<Save className="h-[20px] w-[20px]" />
											) : (
												<PencilSquareIcon className="h-[20px] w-[20px]" />
											)}
										</button>
										{isEditing.description ? (
											<GenericInput
												type="text"
												required
												placeholder={`Inserisci descrizione`}
												name="description"
												value={formData.description}
												handleChange={handleChangeData}
												handleBlur={handleBlur}
												messageError={
													errors.description
												}
												autoFocus={true}
											/>
										) : (
											<p
												className={`break-all self-center body-normal`}
											>
												{formData.description}
											</p>
										)}
									</div>
								</>
							)}
						</div>
						<div className="flex flex-col gap-[8px]">
							<p className="body-normal text-(--black-light-active) font-medium">
								Tipologia della lega:
							</p>
							<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-normal) md:w-1/2 md:mx-auto">
								<TabButton
									handleClick={() =>
										handleTabChange("PUBLIC")
									}
									active={formData.visibility === "PUBLIC"}
								>
									<p className="body-normal">Pubblica</p>
								</TabButton>
								<TabButton
									handleClick={() =>
										handleTabChange("PRIVATE")
									}
									active={formData.visibility === "PRIVATE"}
								>
									<p className="body-normal">Privata</p>
								</TabButton>
							</div>
						</div>

						{["coinName", "maxCoins", "teamMaxPlayers"].map(
							(field) => (
								<div
									key={field}
									className="flex flex-col gap-[8px]"
								>
									<label
										htmlFor={field}
										className="body-normal text-(--black-light-active) font-medium"
									>
										{field === "coinName"
											? "Nome della moneta:"
											: field === "maxCoins"
											? "Budget:"
											: "Numero di player del team:"}
									</label>

									<div className="flex gap-[10px]">
										<button
											className="p-[10px] bg-(--black-light) rounded-full max-h-fit cursor-pointer"
											onClick={() => toggleEditing(field)}
											disabled={status !== "PENDING"}
										>
											{isEditing[field] ? (
												<Save className="h-[20px] w-[20px]" />
											) : (
												<PencilSquareIcon className="h-[20px] w-[20px]" />
											)}
										</button>
										{isEditing[field] ? (
											<GenericInput
												type="text"
												required
												placeholder={`Inserisci ${field}`}
												name={field}
												value={formData[field]}
												handleChange={handleChangeData}
												handleBlur={handleBlur}
												messageError={errors[field]}
												autoFocus={true}
												afterElement={true}
												maxLength={
													field === "coinName"
														? 30
														: 1000
												}
											>
												{field === "coinName" ? (
													<Coins className="stroke-white w-[24px] h-[24px] flex-shrink-0" />
												) : field === "maxCoins" ? (
													<PiggyBank className="stroke-white w-[24px] h-[24px] flex-shrink-0" />
												) : (
													<UserGroupIcon className="stroke-white w-[24px] h-[24px] flex-shrink-0" />
												)}
											</GenericInput>
										) : (
											<div
												className={`bg-[#FAF8F8] w-full rounded-[16px] flex items-center gap-[4px] justify-between`}
											>
												<p
													className={`break-all self-center px-[24px] py-[10px] ${
														field === "name"
															? "body-regular font-medium"
															: "body-normal"
													}
													`}
												>
													{formData[field]}
												</p>
												<div className="bg-(--black-darker) rounded-r-[16px] px-[16px] py-[10px] h-full flex items-center">
													{field === "coinName" ? (
														<Coins className="stroke-white w-[24px] h-[24px] flex-shrink-0" />
													) : field === "maxCoins" ? (
														<PiggyBank className="stroke-white w-[24px] h-[24px] flex-shrink-0" />
													) : (
														<UserGroupIcon className="stroke-white w-[24px] h-[24px] flex-shrink-0" />
													)}
												</div>
											</div>
										)}
									</div>
								</div>
							)
						)}

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
						<div className="flex flex-col gap-[8px] w-full mt-auto">
							<NormalButton
								text="Salva modifiche"
								action={() => handleUpdateLeague()}
								disabled={!isFormValid() || isEditingAnyField}
								customIcon={true}
								classOpt={`md:w-1/2 md:mx-auto`}
							>
								<Save className="h-[24px] w-[24px] flex-shrink-0" />
							</NormalButton>
							<GhostButton
								text="Elimina lega"
								action={showModalConfirmDelete}
								classOpt={`md:w-1/2 md:mx-auto text-(--error-normal)`}
								disabled={isEditingAnyField}
								customIcon={true}
							>
								<TrashIcon className="w-[24px] h-[24px] flex-shrink-0" />
							</GhostButton>
						</div>
					</>
				) : (
					<>
						<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-light-hover) lg:max-w-1/2 lg:min-w-fit md:mx-auto">
							<TabButton
								handleClick={() => setTabActive("Info")}
								active={tabActive === "Info"}
							>
								<p className="body-normal">Info</p>
							</TabButton>
							<TabButton
								handleClick={() => setTabActive("Rules")}
								active={tabActive === "Rules"}
							>
								<p className="body-normal">Regole</p>
							</TabButton>
							<TabButton
								handleClick={() => setTabActive("Players")}
								active={tabActive === "Players"}
							>
								<p className="body-normal">Players</p>
							</TabButton>
						</div>
						{tabActive === "Info" ? (
							<>
								{status === "STARTED" && !isRegistered ? (
									<FixedPopup
										title="Lega giá avviata!"
										message={`Questa lega é stata giá avviata, non puoi piú iscriverti.`}
										customIcon={true}
									>
										<ExclamationTriangleIcon className="w-[20px] h-[20px] flex-shrink-0 fill-orange-500" />
									</FixedPopup>
								) : (
									status === "FINISHED" && (
										<FixedPopup
											title="Lega terminata"
											message={`Questa lega é terminata. Controlla la classifica per verificare il vincitore.`}
											customIcon={true}
										>
											<ExclamationTriangleIcon className="w-[20px] h-[20px] flex-shrink-0 fill-orange-500" />
										</FixedPopup>
									)
								)}
								{isAdmin && status != "FINISHED" && (
									<Select
										options={filteredOptions}
										selectedValue={selectedValue}
										handleChange={showModalConfirmChange}
									/>
								)}
								{description && (
									<div className="flex flex-col gap-[8px]">
										<h2 className="body-normal font-medium text-(--black-light-active)">
											Descrizione:
										</h2>
										<p className="body-normal text-(--black-normal)">
											{description}
										</p>
									</div>
								)}
								<div className="flex flex-col gap-[8px]">
									<h2 className="body-normal font-medium text-(--black-light-active)">
										Nome della moneta:
									</h2>
									<div className="flex gap-[10px]">
										<Coins className="stroke-(--black-light-active) w-[24px] h-[24px] flex-shrink-0" />
										<p className="body-normal text-(--black-normal) self-center">
											{coinName}
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-[8px]">
									<h2 className="body-normal font-medium text-(--black-light-active)">
										Budget:
									</h2>
									<div className="flex gap-[10px]">
										<PiggyBank className="stroke-(--black-light-active) w-[24px] h-[24px] flex-shrink-0" />
										<p className="body-normal text-(--black-normal) self-center">
											{maxCoins}
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-[8px]">
									<h2 className="body-normal font-medium text-(--black-light-active)">
										Numero di player del team:
									</h2>
									<div className="flex gap-[10px]">
										<UserGroupIcon className="stroke-(--black-light-active) w-[24px] h-[24px] flex-shrink-0" />
										<p className="body-normal text-(--black-normal) self-center">
											5 players
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-[8px]">
									<h2 className="body-normal font-medium text-(--black-light-active)">
										&Egrave; concesso un capitano:
									</h2>
									<div className="flex gap-[10px]">
										<Sparkles className="stroke-(--black-light-active) w-[24px] h-[24px] flex-shrink-0" />
										<p className="body-normal text-(--black-normal) self-center">
											{enableCaptain ? "Si" : "No"}, i
											giocatori{" "}
											{enableCaptain
												? "possono"
												: "non possono"}{" "}
											scegliere un capitano.
										</p>
									</div>
								</div>
								{isAdmin && status == "NOT_STARTED" && (
									<div className="flex flex-col gap-[4px]">
										<p className="body-normal font-medium text-(--black-light-active)">
											Codice lega:
										</p>
										<div className="flex gap-[10px]">
											<button onClick={handleCopy}>
												<Clipboard className="w-[24px] h-[24px] stroke-(--black-light-active) flex-shrink-0 cursor-pointer" />
											</button>
											<p
												onClick={handleCopy}
												className="body-normal text-(--black-normal) bg-(--black-light) p-[8px] rounded"
											>
												{code}
											</p>
										</div>
									</div>
								)}
								{status === "NOT_STARTED" && !isRegistered && (
									<NormalButton
										text="Unisciti alla lega"
										action={handleAddParticipant}
										icon={false}
										classOpt="md:w-1/2 md:mx-auto"
									/>
								)}
							</>
						) : tabActive === "Rules" ? (
							<Rules />
						) : (
							<Players />
						)}
					</>
				)}
				<ModalConfirmAction
					isOpen={isModalConfirmOpen.value}
					onClose={() =>
						setIsModalConfirmOpen({ action: null, value: false })
					}
					onConfirmAction={
						isModalConfirmOpen.action == "select"
							? handleChangeSelect
							: handleDeleteLeague
					}
					dataModal={dataModalConfirm}
				/>
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
