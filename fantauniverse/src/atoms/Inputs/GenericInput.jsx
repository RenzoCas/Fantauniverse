import {
	HandRaisedIcon,
	EyeIcon,
	EyeSlashIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function GenericInput({
	type,
	name,
	id,
	required,
	messageError,
	placeholder,
	value,
	handleChange,
	handleBlur,
	autocomplete,
	disabled = false,
}) {
	const [showPassword, setShowPassword] = useState(false);
	const isPasswordType = type === "password";
	const isSearchType = type === "search";
	const isTextarea = type === "textarea";

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<div className="group flex flex-col gap-[8px] w-full">
			<div className="relative">
				{/* Controlla se è una textarea o un input */}
				{isTextarea ? (
					<textarea
						name={name}
						id={id}
						required={required}
						value={value}
						placeholder={`${placeholder}${required ? "*" : ""}`}
						onChange={handleChange}
						onBlur={handleBlur}
						autoComplete={autocomplete}
						className={`w-full px-[24px] py-[10px] text-(--black-normal) rounded-2xl border-2 focus:outline-none placeholder-(--black-normal) ${
							messageError
								? "border-(--error-normal) bg-(--error-light) text-(--error-normal)"
								: "bg-(--black-light-hover) border-transparent focus:border-solid focus:border-[2px] focus:border-(--black-normal)"
						}`}
						maxLength={200}
					/>
				) : (
					<input
						type={isPasswordType && showPassword ? "text" : type}
						name={name}
						id={id}
						required={required}
						value={value}
						placeholder={`${placeholder}${required ? "*" : ""}`}
						onChange={handleChange}
						onBlur={handleBlur}
						autoComplete={autocomplete}
						disabled={disabled}
						className={`w-full px-[24px] py-[10px] text-(--black-normal) rounded-2xl border-2 focus:outline-none placeholder-(--black-normal) ${
							messageError
								? "border-(--error-normal) bg-(--error-light) text-(--error-normal)"
								: "bg-(--black-light-hover) border-transparent focus:border-solid focus:border-[2px] focus:border-(--black-normal)"
						}
                        ${
							isPasswordType || isSearchType
								? "pr-[40px]"
								: "pr-[24px]"
						}`}
					/>
				)}

				{/* Se il tipo è password, aggiungi il pulsante per mostrare/nascondere */}
				{isPasswordType && (
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-(--black-normal) focus:outline-(--black-normal)"
					>
						{showPassword ? (
							<EyeSlashIcon className="h-[24px] w-[24px]" />
						) : (
							<EyeIcon className="h-[24px] w-[24px]" />
						)}
					</button>
				)}

				{/* Se il tipo è search, aggiungi l'icona di ricerca */}
				{isSearchType && (
					<button className="absolute right-4 top-1/2 -translate-y-1/2 text-(--black-normal)">
						<MagnifyingGlassIcon className="h-[20px] w-[20px]" />
					</button>
				)}
			</div>

			{/* Mostra il messaggio di errore se c'è */}
			{messageError && (
				<p className="body-small text-(--error-normal) flex items-center gap-2">
					<HandRaisedIcon className="h-[16px] w-[16px] text-(--error-normal) flex-shrink-0" />
					{messageError}
				</p>
			)}
		</div>
	);
}
