import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import NormalButton from "../../atoms/Buttons/NormalButton";
import GenericInput from "../../atoms/Inputs/GenericInput";
import GhostButton from "../../atoms/Buttons/GhostButton";

function ModalRule({ isOpen, isEdit, playerObj, onClose, onSubmit, onDelete }) {
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		icon: "",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (isEdit && playerObj) {
			setFormData(playerObj);
		} else {
			setFormData({
				name: "",
				price: "",
				icon: "",
			});
		}
	}, [playerObj, isEdit]);

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
					formData.icon = base64Image;
				};
				reader.readAsDataURL(file);
			} else {
				throw new Error("Per favore seleziona un file JPEG o PNG.");
			}
		} catch (error) {
			alert(error.message);
		}
	};

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

			setFormData((prev) => ({
				...prev,
				[name]: numericValue,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
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

	return (
		<div
			id="modalPlayer"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-t-lg p-4 w-full transition-transform duration-500 ease flex flex-col gap-[4px] z-100 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[24px] w-[24px]" />
				</button>
				<div className="flex flex-col gap-[16px]">
					<h4 className="font-semibold text-(--black-normal)">
						{isEdit ? "Modifica" : "Aggiungi"} Player
					</h4>
					<form
						onSubmit={(e) => {
							e.preventDefault();
						}}
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
							placeholder="Prezzo player"
							messageError={errors.price}
							value={formData.price}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
                        <div className="flex flex-col gap-[8px] justify-end">
                            <label
                                htmlFor="immaginePlayer"
                                className="body-small font-semibold text-(--black-normal)"
                            >
                                Aggiungi immagine:
                            </label>
                            <input
                                type="file"
                                name="immaginePlayer"
                                id="immaginePlayer"
                                accept="image/jpeg, image/png"
                                value={formData.icon}
                                onChange={handleFileChange}
                            />
                        </div>
						<NormalButton
							text={
								isEdit ? "Modifica Player" : "Aggiungi Player"
							}
							action={() => onSubmit(formData)}
							disabled={!isFormValid()}
						/>
						{isEdit && (
							<GhostButton
								text="Elimina Player"
								action={() => onDelete(playerObj.id)}
								classOpt="text-(--error-normal)"
								customIcon={true}
							>
								<TrashIcon className="w-[24px] h-[24px]" />
							</GhostButton>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}

export default ModalRule;
