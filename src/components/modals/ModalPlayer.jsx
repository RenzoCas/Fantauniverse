import {
	PencilSquareIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import NormalButton from "../../atoms/Buttons/NormalButton";
import GenericInput from "../../atoms/Inputs/GenericInput";
import GhostButton from "../../atoms/Buttons/GhostButton";
import { useModal } from "../../contexts/ModalContext";
import FocusModal from "../../hooks/FocusModal";
import { PlusIcon } from "lucide-react";

function ModalPlayer({
	isOpen,
	isEdit,
	playerObj,
	onClose,
	onSubmit,
	onDelete,
}) {
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		icon: "",
	});
	const [errors, setErrors] = useState({});
	const [fileKey, setFileKey] = useState(Date.now());
	const { openBackdrop, closeBackdrop } = useModal();
	const modalRef = useRef(null);
	FocusModal(modalRef, isOpen);

	useEffect(() => {
		if (isOpen) {
			openBackdrop();
		} else {
			closeBackdrop();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

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
	}, [playerObj, isEdit, isOpen]);

	const handleFileChange = async (event) => {
		try {
			const file = event.target.files[0];
			if (
				file &&
				(file.type === "image/jpeg" || file.type === "image/png")
			) {
				formData.icon = file;
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
		<>
			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				tabIndex="-1"
				className={`fixed bottom-0 left-0 bg-white shadow-lg rounded-t-[12px] p-[16px] lg:p-[24px] w-full transition-all duration-300 ease flex flex-col gap-[16px] z-1001 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:rounded-[12px] lg:max-w-[500px] ${
					isOpen
						? "scale-100 opacity-100 translate-y-0 lg:bottom-1/2 lg:translate-y-1/2 visible"
						: "scale-80 opacity-30 translate-y-full lg:translate-y-0 invisible"
				}`}
			>
				<div className="flex items-center justify-between gap-[8px]">
					<h4 className="font-semibold text-(--black-normal)">
						{isEdit ? "Modifica" : "Aggiungi"} Player
					</h4>
					<button onClick={onClose} className="cursor-pointer">
						<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
					</button>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit(formData);
						setFileKey(Date.now());
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
							{isEdit ? "Aggiorna immagine" : "Aggiungi immagine"}
						</label>
						<input
							key={fileKey}
							type="file"
							name="immaginePlayer"
							id="immaginePlayer"
							accept="image/jpeg, image/png"
							onChange={handleFileChange}
						/>
					</div>
					<NormalButton
						text={isEdit ? "Modifica Player" : "Aggiungi Player"}
						disabled={!isFormValid()}
						customIcon={true}
						type="submit"
					>
						{isEdit ? (
							<PencilSquareIcon className="h-[24px] w-[24px] flex-shrink-0" />
						) : (
							<PlusIcon className="h-[24px] w-[24px] flex-shrink-0" />
						)}
					</NormalButton>
					{isEdit && (
						<GhostButton
							text="Elimina Player"
							action={() => onDelete(playerObj.id)}
							classOpt="text-(--error-normal)"
							customIcon={true}
						>
							<TrashIcon className="w-[24px] h-[24px] flex-shrink-0" />
						</GhostButton>
					)}
				</form>
			</div>
		</>
	);
}

export default ModalPlayer;
