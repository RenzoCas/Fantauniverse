import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
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

function Account() {
	const { user, updateUser } = useUser();
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
	const [isModalPasswordVisible, setIsModalPasswordVisible] = useState(false);
	const [randomColor, setRandomColor] = useState("#ffffff");
	const messageError = "Campo obbligatorio";
	const fileInputRef = useRef(null);

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
		setIsLoading(false);
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

	const [isEditing, setIsEditing] = useState({
		username: false,
		email: false,
	});

	const isEditingAnyField = Object.values(isEditing).some(
		(isEditing) => isEditing
	);

	const toggleEditing = (field) => {
		setIsEditing((prev) => ({
			...Object.keys(prev).reduce((acc, key) => {
				acc[key] = key === field ? !prev[key] : false;
				return acc;
			}, {}),
		}));
	};

	return (
		<>
			{isLoading && <Loader />}

			<Navbar />
			<main className="flex flex-col gap-[16px] max-w-xl mx-auto py-[24px] px-[16px] lg:py-16 lg:px-6 min-h-[calc(100dvh-64px)]">
				<h1 className="title-h4 font-medium">Impostazioni Account</h1>
				<section className="flex flex-col gap-[12px]">
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
						<picture className="rounded-[32px] min-w-[90px] max-w-[90px] h-[90px] overflow-hidden outline outline-solid">
							{user?.icon == null ? (
								<div
									className={`h-full object-cover`}
									style={{
										backgroundColor: randomColor,
									}}
								></div>
							) : (
								<img
									src={`data:image/png;base64,${user?.icon}`}
									alt={`Icona utente`}
									className="h-full object-cover"
								/>
							)}
						</picture>
						<div className="flex items-center gap-[8px]">
							<button
								onClick={handleUpdateImage}
								className="body-normal"
							>
								Cambia avatar
							</button>
							<button
								onClick={handleDeleteImage}
								className="body-normal text-(--error-normal)"
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
									className="p-[10px] bg-(--black-light) rounded-full max-h-fit"
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

					<div className="flex flex-col gap-[8px]">
						<p className="body-small text-(--black-light-active) font-medium capitalize">
							Password:
						</p>
						<NormalButton
							text="Clicca per cambiare password"
							icon={false}
							roundedFull={false}
							classOpt="rounded-[16px]"
							action={() => setIsModalPasswordVisible(true)}
						/>
					</div>
				</section>
				<section className="flex flex-col gap-[8px] mt-auto">
					<NormalButton
						text="Salva impostazioni"
						icon={false}
						action={handleSubmit}
						disabled={!isFormValid() || isEditingAnyField}
					/>
					<GhostButton
						text="Elimina Account"
						customIcon={true}
						classOpt="text-(--error-normal)"
					>
						<TrashIcon className="stroke-(--error-normal) w-[24px] h-[24px]" />
					</GhostButton>
				</section>

				<ModalChangePassword
					isOpen={isModalPasswordVisible}
					onClose={() => setIsModalPasswordVisible(false)}
				/>

				<GenericPopup
					isOpen={popupData.isOpen}
					type={popupData.type}
					title={popupData.title}
					message={popupData.message}
				/>
			</main>
		</>
	);
}

export default Account;
