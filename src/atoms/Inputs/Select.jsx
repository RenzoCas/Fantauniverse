import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

function Select({ options, selectedValue, handleChange, label }) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionClick = (value) => {
		handleChange(value);
		setIsOpen(false);
	};

	return (
		<div className="relative">
			{label && (
				<label className="block text-sm font-semibold mb-2">
					{label}
				</label>
			)}

			<div
				className="bg-(--black-light) rounded-[8px] p-[10px] cursor-pointer flex justify-center items-center gap-[4px]"
				onClick={toggleMenu}
			>
				<span className="body-small font-semibold text-(--error-normal)">
					{options.find((opt) => opt.value === selectedValue)?.text ||
						"Seleziona un'opzione"}
				</span>
				{isOpen ? (
					<ChevronUpIcon className="h-[20px] w-[20px]" />
				) : (
					<ChevronDownIcon className="h-[20px] w-[20px]" />
				)}
			</div>

			{isOpen && (
				<div className="absolute top-full left-0 mt-2 bg-white border border-(--black-light) rounded-md shadow-md z-10 w-full">
					{options.map((option) => (
						<button
							key={option.value}
							onClick={() => handleOptionClick(option.value)}
							className={`p-[8px] cursor-pointer w-full text-left ${
								option.value === selectedValue
									? "bg-(--black-light)"
									: ""
							} ${option.isDisabled && "text-(--black-light)"}`}
							disabled={option.isDisabled}
						>
							{option.text}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default Select;
