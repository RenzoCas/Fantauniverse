import { useEffect, useRef, useState } from "react";
import CardAccountSettings from "../components/CardAccountSettings";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import Loader from "../components/Loader";
import NormalButton from "../atoms/Buttons/NormalButton";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import GenericInput from "../atoms/Inputs/GenericInput";
import GenericPopup from "../components/popups/GenericPopup";
import GhostButton from "../atoms/Buttons/GhostButton";

function Account() {
	const { user, updateUser } = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [isModalImgOpen, setIsModalImgOpen] = useState(false);
	const [isModalDataOpen, setIsModalDataOpen] = useState(false);
	const [textToUpdate, setTextToUpdate] = useState();
	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		id: "",
		username: "",
		email: "",
		password: "",
		icon: null,
	});
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});

	useEffect(() => {
		setFormData({
			id: user?.id,
			username: user?.username,
			email: user?.email,
			password: user?.password,
			icon: user?.icon,
		});
	}, [user]);

	const messageError = "Campo obbligatorio";
	const fileInputRef = useRef(null);
	if (!user) {
		return;
	}
	const { username, email, password, icon } = user;

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const validatePassword = (password) =>
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(
			password
		);

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
		} else if (name === "password" && !validatePassword(value)) {
			error =
				"La password deve contenere almeno 8 caratteri, una maiuscola, un numero e un carattere speciale";
		} else if (name === "confermaPassword" && value !== formData.password) {
			error = "Le password non coincidono";
		}

		setErrors({ ...errors, [name]: error });
	};

	const isFormValid = (textToUpdate) => {
		switch (textToUpdate) {
			case "username":
				return formData.username && formData.username != user.username
					? true
					: false;
			case "email":
				return (
					validateEmail(formData.email) &&
					formData.email != user.email
				);
			case "password":
				return validatePassword(formData.password);
			default:
				break;
		}
	};

	const handleUpdateImage = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleDeleteImage = async () => {
		const updatedUserData = { ...user, icon: null };
		setIsModalImgOpen(false);
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

	const handleUpdateData = (field) => {
		setTextToUpdate(field);
		setFormData((prev) => ({
			...prev,
			[field]: user[field] || "",
		}));
		setIsModalDataOpen(true);
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
		setIsModalDataOpen(false);
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

	return (
		<>
			{isLoading && <Loader />}

			<Navbar />
			<main className="flex flex-col gap-[24px] max-w-xl mx-auto py-[24px] px-[16px] lg:py-16 lg:px-6 min-h-[calc(100dvh-64px)]">
				<h1 className="title-h4 font-semibold">Accesso e sicurezza</h1>
				<CardAccountSettings
					setting="Username"
					value={username}
					onUpdate={() => {
						handleUpdateData("username");
					}}
				/>
				<CardAccountSettings
					setting="Email"
					value={email}
					onUpdate={() => {
						handleUpdateData("email");
					}}
				/>
				<CardAccountSettings
					setting="Password"
					value={password}
					onUpdate={() => {
						handleUpdateData("password");
					}}
				/>
				<input
					type="file"
					name="logo"
					id="logoLega"
					accept="image/jpeg, image/png"
					onChange={handleFileChange}
					ref={fileInputRef}
					className="hidden"
				/>
				<CardAccountSettings
					setting="Icona"
					value={icon}
					onUpdate={handleUpdateImage}
					viewImage={() => setIsModalImgOpen(true)}
				/>
				<GenericPopup
					isOpen={popupData.isOpen}
					type={popupData.type}
					title={popupData.title}
					message={popupData.message}
				/>
			</main>

			{isModalImgOpen && (
				<div className="fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end md:items-center transition-opacity duration-500 ease z-1000 opacity-100 visible">
					<div className="bg-white shadow-lg rounded-lg p-[16px] md:py-[24px] w-full transition-transform duration-500 ease flex flex-col gap-[16px] translate-y-0 md:max-w-[600px] md:rounded-lg md:items-center md:justify-center">
						{!icon ? (
							<>
								<div className="flex justify-between gap-[8px] items-center">
									<p className="font-semibold">
										Icona non presente
									</p>
									<button
										onClick={() => setIsModalImgOpen(false)}
									>
										<XMarkIcon className="h-[24px] w-[24px]" />
									</button>
								</div>
								<NormalButton
									text="Aggiungi icona"
									action={handleUpdateImage}
									customIcon={true}
								>
									<PlusIcon className="h-[20px] w-[20px] bg-(--black-light) stroke-(--black-normal) rounded-full" />
								</NormalButton>
							</>
						) : (
							<>
								<button
									onClick={() => setIsModalImgOpen(false)}
									className="flex self-end"
								>
									<XMarkIcon className="h-[24px] w-[24px]" />
								</button>
								<img
									src={`data:image/png;base64,${icon}`}
									alt="Icona utente"
									className="max-w-full max-h-[400px] rounded-lg"
								/>
								<GhostButton
									text="Rimuovi immagine"
									customIcon={true}
									classOpt="text-(--error-normal)"
									action={handleDeleteImage}
								>
									<TrashIcon className="h-[24px] w-[24px] stroke-(--error-normal)" />
								</GhostButton>
							</>
						)}
					</div>
				</div>
			)}

			{isModalDataOpen && (
				<div className="fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end md:items-center transition-opacity duration-500 ease z-1000 opacity-100 visible">
					<div className="bg-white shadow-lg rounded-lg p-[16px] md:py-[24px] w-full transition-transform duration-500 ease flex flex-col gap-[16px] translate-y-0 md:max-w-[600px] md:rounded-lg md:items-center md:justify-center">
						<div className="flex justify-between gap-[8px] items-center">
							<p className="font-semibold">
								Modifica {textToUpdate}
							</p>
							<button onClick={() => setIsModalDataOpen(false)}>
								<XMarkIcon className="h-[24px] w-[24px]" />
							</button>
						</div>
						<GenericInput
							id={textToUpdate}
							name={textToUpdate}
							required
							value={formData[textToUpdate] || ""}
							placeholder={textToUpdate}
							type={
								textToUpdate === "password"
									? "password"
									: "text"
							}
							handleChange={handleChange}
							handleBlur={handleBlur}
							messageError={errors[textToUpdate]}
						/>

						<NormalButton
							text={`Aggiorna ${textToUpdate}`}
							action={handleSubmit}
							disabled={!isFormValid(textToUpdate)}
						/>
					</div>
				</div>
			)}
		</>
	);
}

export default Account;
