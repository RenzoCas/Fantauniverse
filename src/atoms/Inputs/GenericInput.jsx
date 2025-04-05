import { useState, useEffect, useRef } from "react";
import {
	HandRaisedIcon,
	EyeIcon,
	EyeSlashIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

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
	autoFocus = false,
	maxLength = 1000,
	classOpt,
	afterElement = false,
	children,
}) {
	const [showPassword, setShowPassword] = useState(false);
	const isPasswordType = type === "password";
	const isSearchType = id?.includes("search");
	const isTextarea = type === "textarea";
	const inputRef = useRef(null);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [autoFocus]);

	return (
		<div className="group flex flex-col gap-[8px] w-full">
			<div className="relative">
				{isTextarea ? (
					<textarea
						ref={inputRef}
						name={name}
						id={id}
						required={required}
						value={value}
						placeholder={`${
							placeholder
								? required
									? placeholder + "*"
									: placeholder
								: ""
						}`}
						onChange={handleChange}
						onBlur={handleBlur}
						autoComplete={autocomplete}
						className={`w-full px-[24px] py-[10px] text-(--black-normal) rounded-2xl outline-2 focus:outline-none placeholder-(--black-normal) break-all max-h-[200px] ${
							messageError
								? "outline-(--error-normal) bg-(--error-light) text-(--error-normal)"
								: "bg-[#FAF8F8] outline-transparent focus:outline-solid focus:outline-[2px] focus:outline-(--black-normal)"
						} ${classOpt ? classOpt : ""}`}
						maxLength={200}
					/>
				) : (
					<input
						ref={inputRef}
						type={isPasswordType && showPassword ? "text" : type}
						name={name}
						id={id}
						required={required}
						value={value}
						placeholder={`${
							placeholder
								? required
									? placeholder + "*"
									: placeholder
								: ""
						}`}
						onChange={handleChange}
						onBlur={handleBlur}
						autoComplete={autocomplete}
						disabled={disabled}
						maxLength={maxLength}
						className={`w-full px-[24px] py-[10px] text-(--black-normal) rounded-2xl outline-2 focus:outline-none placeholder-(--black-normal) break-all ${
							messageError
								? "outline-(--error-normal) bg-(--error-light) text-(--error-normal)"
								: "bg-[#FAF8F8] outline-transparent focus:outline-solid focus:outline-[2px] focus:outline-(--black-normal)"
						} ${
							isPasswordType || isSearchType
								? "pr-[40px]"
								: afterElement
								? "pr-[60px]"
								: "pr-[24px]"
						} ${classOpt ? classOpt : ""}`}
					/>
				)}

				{isPasswordType && (
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-(--black-normal) focus:outline-(--black-normal) break-all"
					>
						{showPassword ? (
							<EyeSlashIcon className="h-[24px] w-[24px] flex-shrink-0" />
						) : (
							<EyeIcon className="h-[24px] w-[24px] flex-shrink-0" />
						)}
					</button>
				)}

				{isSearchType && (
					<button className="absolute right-4 top-1/2 -translate-y-1/2 text-(--black-normal)">
						<MagnifyingGlassIcon className="h-[20px] w-[20px]" />
					</button>
				)}

				{afterElement && (
					<div className="absolute right-0 top-1/2 -translate-y-1/2 bg-(--black-darker) rounded-r-[16px] px-[16px] py-[10px]">
						{children}
					</div>
				)}
			</div>

			{messageError && (
				<p className="body-small text-(--error-normal) flex items-center gap-2">
					<HandRaisedIcon className="h-[16px] w-[16px] text-(--error-normal) flex-shrink-0" />
					{messageError}
				</p>
			)}
		</div>
	);
}
