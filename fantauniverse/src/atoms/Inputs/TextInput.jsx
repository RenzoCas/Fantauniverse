import { HandRaisedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function InputWithError({ name, id, required, messageError }) {
	const [value, setValue] = useState("");
	const [showError, setShowError] = useState(false);

	const handleChange = (e) => {
		const newValue = e.target.value;
		setValue(newValue);
	};

	const handleBlur = () => {
		const isError = required && value.trim() === "";
		setShowError(isError);
	};

	return (
		<div className="group flex flex-col gap-[8px]">
			<input
				type="text"
				name={name}
				id={id}
				required={required}
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
				className={`px-[24px] py-[10px] body-regular text-(--black-normal) rounded-[16px] border-2 
            ${
				showError
					? "border-(--error-normal) bg-(error-light) text-(--error-normal)"
					: "bg-(--black-light-hover) border-transparent focus:border-solid focus:border-[2px] focus:border-(--black-normal)"
			} 
          `}
			/>
			{showError && (
				<p className="body-small text-red-500 flex gap-[8px]">
					<HandRaisedIcon className="h-[16px] w-[16px] text-red-500" />
					{messageError}
				</p>
			)}
		</div>
	);
}
