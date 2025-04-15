import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import NormalButton from "../../atoms/Buttons/NormalButton";
import GenericInput from "../../atoms/Inputs/GenericInput";
import TabButton from "../../atoms/Buttons/TabButton";
import GhostButton from "../../atoms/Buttons/GhostButton";
import { useModal } from "../../contexts/ModalContext";
import FocusModal from "../../hooks/FocusModal";

function ModalRule({
	isOpen,
	isEdit,
	ruleObj,
	onClose,
	onSubmit,
	onDelete,
	startTabActive,
}) {
	const [formData, setFormData] = useState({
		name: "",
		rule: "",
		value: "",
		malus: startTabActive == "Malus" ? true : false,
	});
	const [errors, setErrors] = useState({});
	const [tabActive, setTabActive] = useState(startTabActive);
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
		if (ruleObj) {
			setFormData(ruleObj);
		} else {
			setFormData({
				name: "",
				rule: "",
				value: "",
				malus: startTabActive == "Malus" ? true : false,
			});
		}
	}, [ruleObj, startTabActive]);

	useEffect(() => {
		if (isOpen) {
			setTabActive(startTabActive);
		}
	}, [isOpen, startTabActive]);

	const handleTabChange = (tab) => {
		setTabActive(tab);
		setFormData((prev) => ({
			...prev,
			malus: tab === "Malus",
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "value") {
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
			formData.rule.trim() !== "" &&
			formData.value !== "" &&
			formData.value > 0
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
						{isEdit ? "Modifica" : "Aggiungi"} Regola
					</h4>
					<button onClick={onClose} className="cursor-pointer">
						<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
					</button>
				</div>
				<div className="flex flex-col gap-[16px]">
					<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-dark)">
						<TabButton
							handleClick={() => handleTabChange("Bonus")}
							active={tabActive === "Bonus"}
						>
							<p className="body-normal">Bonus</p>
						</TabButton>
						<TabButton
							handleClick={() => handleTabChange("Malus")}
							active={tabActive === "Malus"}
						>
							<p className="body-normal">Malus</p>
						</TabButton>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							onSubmit(formData);
							setFormData({
								name: "",
								rule: "",
								value: "",
								malus: false,
							});
						}}
						className="flex flex-col gap-4"
					>
						<GenericInput
							type="text"
							required
							name="name"
							id="name"
							placeholder="Nome regola"
							messageError={errors.name}
							value={formData.name}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<GenericInput
							type="textarea"
							required
							name="rule"
							id="rule"
							placeholder="Testo regola"
							messageError={errors.rule}
							value={formData.rule}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<GenericInput
							type="text"
							required
							name="value"
							id="value"
							placeholder="Punteggio regola"
							messageError={errors.value}
							value={formData.value}
							handleChange={handleChange}
							handleBlur={handleBlur}
						/>
						<NormalButton
							text={
								isEdit ? "Modifica Regola" : "Aggiungi Regola"
							}
							action={() => {
								onSubmit(formData);
								setFormData({
									name: "",
									rule: "",
									value: "",
									malus: false,
								});
							}}
							disabled={!isFormValid()}
						/>
						{isEdit && (
							<GhostButton
								text="Elimina Regola"
								action={() => onDelete(ruleObj.id)}
								classOpt="text-(--error-normal)"
								customIcon={true}
							>
								<TrashIcon className="w-[24px] h-[24px] flex-shrink-0" />
							</GhostButton>
						)}
					</form>
				</div>
			</div>
		</>
	);
}

export default ModalRule;
