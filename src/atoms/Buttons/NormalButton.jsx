import { BoltIcon } from "@heroicons/react/24/outline";

export default function NormalButton({
	text,
	action,
	disabled = false,
	icon = true,
	classOpt,
	customIcon = false,
	children,
	roundedFull = true,
	type = "button",
}) {
	return (
		<button
			onClick={action}
			disabled={disabled}
			type={type}
			className={`group flex items-center justify-center gap-[8px] px-[24px] py-[12px] cursor-pointer ${
				roundedFull ? "rounded-full" : ""
			}
            ${classOpt ? classOpt : ""}
        ${
			disabled
				? "bg-(--black-light) text-(--black-normal)/25 cursor-not-allowed"
				: "bg-(--black-normal) text-white hover:bg-(--black-dark)"
		}
      `}
		>
			{text && <span>{text}</span>}
			{icon && !customIcon && (
				<BoltIcon
					className={`h-[24px] w-[24px] p-[4px] rounded-full flex-shrink-0 ${
						disabled
							? "opacity-[25]"
							: "text-(--black-normal) bg-(--black-light) group-hover:bg-(--black-normal) group-hover:text-white"
					}`}
				/>
			)}
			{icon && customIcon && children}
		</button>
	);
}
