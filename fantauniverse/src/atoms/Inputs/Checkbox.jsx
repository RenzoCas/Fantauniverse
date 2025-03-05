import { HandRaisedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function Checkbox({
	name,
	id,
	required,
	messageError,
	label,
	checked,
	handleChange,
}) {
	const [touched, setTouched] = useState(false);

	const handleBlur = () => {
		setTouched(true);
	};

	return (
		<div className="group flex flex-col gap-[8px]">
			<div className="flex gap-[10px] items-center">
				<input
					type="checkbox"
					name={name}
					id={id}
					required={required}
					checked={checked}
					onChange={handleChange}
					onBlur={handleBlur}
					className={`min-w-[18px] min-h-[18px] bg-(--black-light-hover) accent-(--black-light-hover) radius-[4px] focus:border-solid focus:border-[2px] focus:border-(--black-normal) cursor-pointer ${
						touched && required && !checked
							? "bg-(--error-light)"
							: ""
					}`}
				/>
				<label
					htmlFor={id}
					className="body-normal text-(--black-normal)"
				>
					{`${label}${required ? "*" : ""}`}
				</label>
			</div>

			{touched == true && required == true && checked == false && (
				<p className="body-small text-(--error-normal) flex items-center gap-2">
					<HandRaisedIcon className="h-4 w-4 text-(--error-normal)" />
					{messageError}
				</p>
			)}
		</div>
	);
}

export default Checkbox;
