import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import Loader from "../components/Loader";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import GenericInput from "../atoms/Inputs/GenericInput";
import GenericPopup from "../components/popups/GenericPopup";
import { Save } from "lucide-react";
import { TrashIcon } from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";
import GhostButton from "../atoms/Buttons/GhostButton";
import ModalChangePassword from "../components/modals/ModalChangePassword";
import ModalConfirmAction from "../components/modals/ModalConfirmAction";
import Logo from "../atoms/Logo";

function Account() {
	const { user, updateUser, unregister, updatePassword } = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		id: user?.id || "",
		username: user?.username || "",
		email: user?.email || "",
	});
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
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
	const [isModalPasswordVisible, setIsModalPasswordVisible] = useState(false);
	const [randomColor, setRandomColor] = useState("#ffffff");
	const messageError = "Campo obbligatorio";
	const fileInputRef = useRef(null);
	const [isEditing, setIsEditing] = useState({
		username: false,
		email: false,
	});

	const isEditingAnyField = Object.values(isEditing).some(
		(isEditing) => isEditing
	);

	useEffect(() => {
		setRandomColor(randomLightColor());
	}, []);

	const randomLightColor = () => {
		const getRandomValue = () => Math.floor(Math.random() * 128) + 128;
		const r = getRandomValue();
		const g = getRandomValue();
		const b = getRandomValue();
		return `#${r.toString(16).padStart(2, "0")}${g
			.toString(16)
			.padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		let error = "";

		if (!value && name !== "privacy") {
			error = messageError;
		} else if (name === "email" && !validateEmail(value)) {
			error = "Email non valida";
		}

		setErrors({ ...errors, [name]: error });
	};

	const isFormValid = () => {
		return (
			!Object.values(errors).some((error) => error !== "") &&
			(formData.username.trim() !== user?.username ||
				formData.email.trim() !== user?.email)
		);
	};

	const handleUpdateImage = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleDeleteImage = async () => {
		const updatedUserData = { ...user, icon: null };
		setIsLoading(true);
		const res = await updateUser(updatedUserData);
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore nella rimozione dell'immagine!",
				"Immagine non rimossa. Riprova"
			);
			return;
		}
		setIsLoading(false);
		showPopup(
			"success",
			"Aggiornamento completato!",
			"Immagine rimossa correttamente."
		);
	};

	const handleFileChange = async (event) => {
		try {
			const file = event.target.files[0];
			if (
				file &&
				(file.type === "image/jpeg" || file.type === "image/png")
			) {
				const reader = new FileReader();
				reader.onloadend = async () => {
					const base64Image = reader.result.split(",")[1];
					const updatedUserData = { ...user, icon: base64Image };
					setIsLoading(true);
					const res = await updateUser(updatedUserData);
					if (!res) {
						setIsLoading(false);
						showPopup(
							"error",
							"Errore nell'aggiornamento dell'immagine!",
							"Immagine non aggiornata. Riprova"
						);
						return;
					}
					setIsLoading(false);
					showPopup(
						"success",
						"Aggiornamento completato!",
						"Immagine modificata correttamente."
					);
					setIsLoading(false);
				};
				reader.readAsDataURL(file);
			} else {
				throw new Error("Per favore seleziona un file JPEG o PNG.");
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const res = await updateUser(formData);
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Errore nell'aggiornamento dell'utente!",
				"Dati non modificati. Riprova"
			);
			return;
		}
		setIsLoading(false);
		showPopup(
			"success",
			"Aggiornamento completato!",
			"Dati modificati correttamente."
		);
	};

	const showModalConfirmUnregister = () => {
		setDataModalConfirm({
			title: "Elimina account",
			text: "Confermando il tuo account verrá definitivamente cancellato.",
			conferma: "Conferma",
			annulla: "Annulla",
		});
		setIsModalConfirmOpen({ action: "delete", value: true });
	};

	const handleUnregister = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const res = await unregister();
		if (!res) {
			setIsLoading(false);
			showPopup(
				"error",
				"Account non eliminato!",
				"C'é stato un problema nella cancellazione dell'account. Riprova."
			);
			return;
		}
		setIsLoading(false);
		showPopup(
			"success",
			"Account eliminato!",
			"L'account é stato elimiato correttamente."
		);
	};

	const toggleEditing = (field) => {
		setIsEditing((prev) => ({
			...Object.keys(prev).reduce((acc, key) => {
				acc[key] = key === field ? !prev[key] : false;
				return acc;
			}, {}),
		}));
	};

	const handleChangePassword = async (formData) => {
		const filteredData = Object.fromEntries(
			Object.entries(formData).filter(
				([key]) => key !== "confermaPassword"
			)
		);

		setIsLoading(true);
		const result = await updatePassword(filteredData);
		if (!result) {
			setIsLoading(false);
			showPopup(
				"error",
				"Password non modificata!",
				"La vecchia password inserita non é corretta."
			);
			return;
		}
		setIsLoading(false);
		showPopup(
			"success",
			"Password modificata!",
			"La modifica della password é andata a buon fine."
		);
	};

	return (
		<>
			{isLoading && <Loader />}
			<div className="hidden lg:fixed lg:top-[8px] lg:left-[370px] lg:flex lg:w-full lg:px-[20px] lg:py-[20px] lg:border-b-2 lg:border-b-solid lg:border-b-(--black-light-hover) lg:max-w-[calc(100vw-370px)]">
				<Logo />
			</div>
			<section className="flex flex-col gap-[16px] h-full">
				<h1 className="title-h4 font-medium">Impostazioni Account</h1>
				<div className="flex flex-col gap-[12px]">
					<div className="flex flex-col gap-[8px] w-full items-center">
						<input
							type="file"
							name="logo"
							id="logoLega"
							accept="image/jpeg, image/png"
							onChange={handleFileChange}
							ref={fileInputRef}
							className="hidden"
						/>
						<picture className="rounded-[32px] w-[90px] h-[90px] flex-shrink-0 overflow-hidden outline outline-solid lg:w-[371px] lg:h-full lg:aspect-video lg:outline-none relative">
							{user?.icon == null ? (
								<div
									className={`h-full object-cover`}
									style={{
										backgroundColor: randomColor,
									}}
								>
									<div className="title-h3 font-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex items-center justify-center w-full h-full">
										{user?.username
											.slice(0, 2)
											.toUpperCase()}
									</div>
								</div>
							) : (
								<img
									src={`data:image/png;base64,${user?.icon}`}
									alt={`Icona utente`}
									className="h-full object-cover"
									loading="lazy"
								/>
							)}
						</picture>
						<div className="flex items-center gap-[8px]">
							<button
								onClick={handleUpdateImage}
								className="body-normal cursor-pointer"
							>
								Cambia avatar
							</button>
							<button
								onClick={handleDeleteImage}
								className="body-normal text-(--error-normal) cursor-pointer"
							>
								Elimina avatar
							</button>
						</div>
					</div>
					{["username", "email"].map((field) => (
						<div key={field} className="flex flex-col gap-[8px]">
							<label
								htmlFor={field}
								className="body-small text-(--black-light-active) font-medium capitalize"
							>
								{field}:
							</label>
							<div className="flex gap-[10px]">
								<button
									className="p-[10px] bg-(--black-light) rounded-full max-h-fit cursor-pointer"
									onClick={() => toggleEditing(field)}
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
										handleChange={handleChange}
										handleBlur={handleBlur}
										messageError={errors[field]}
										autoFocus={true}
										maxLength={
											field === "username" ? 20 : 1000
										}
									/>
								) : (
									<p
										className={`break-all self-center ${
											field === "name"
												? "body-regular font-medium"
												: "body-normal"
										}`}
									>
										{formData[field]}
									</p>
								)}
							</div>
						</div>
					))}

					{!user.provider && (
						<div className="flex flex-col gap-[8px]">
							<p className="body-small text-(--black-light-active) font-medium capitalize">
								Password:
							</p>
							<NormalButton
								text="Clicca per cambiare password"
								icon={false}
								roundedFull={false}
								classOpt="rounded-[16px] md:w-1/2"
								action={() => setIsModalPasswordVisible(true)}
							/>
						</div>
					)}
				</div>
				<section className="flex flex-col gap-[8px] mt-auto">
					<NormalButton
						text="Salva impostazioni"
						icon={false}
						action={handleSubmit}
						disabled={!isFormValid() || isEditingAnyField}
						classOpt="md:w-1/2 md:mx-auto"
					/>
					<GhostButton
						text="Elimina Account"
						customIcon={true}
						classOpt="text-(--error-normal) md:w-1/2 md:mx-auto"
						action={showModalConfirmUnregister}
					>
						<TrashIcon className="stroke-(--error-normal) w-[24px] h-[24px] flex-shrink-0" />
					</GhostButton>
				</section>
				<ModalChangePassword
					isOpen={isModalPasswordVisible}
					onClose={() => setIsModalPasswordVisible(false)}
					handleChangePassword={handleChangePassword}
				/>
				<ModalConfirmAction
					isOpen={isModalConfirmOpen.value}
					onClose={() =>
						setIsModalConfirmOpen({ action: null, value: false })
					}
					onConfirmAction={handleUnregister}
					dataModal={dataModalConfirm}
				/>
				<GenericPopup
					isOpen={popupData.isOpen}
					type={popupData.type}
					title={popupData.title}
					message={popupData.message}
				/>
			</section>
		</>
	);
}

export default Account;
