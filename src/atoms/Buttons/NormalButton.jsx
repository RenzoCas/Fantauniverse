import { BoltIcon } from "@heroicons/react/24/outline";

export default function NormalButton({
	text,
	action,
	disabled = false,
	icon = true,
	classOpt,
	customIcon = false,
	children,
}) {
	return (
		<button
			onClick={action}
			disabled={disabled}
			type="button"
			className={`group flex items-center justify-center gap-[8px] rounded-full px-[24px] py-[12px] text-white ${
				classOpt ? classOpt : ""
			}
        ${
			disabled
				? "bg-(--black-light) text-(--black-normal)/25 cursor-not-allowed"
				: "bg-(--black-normal) text-(--white) hover:bg-(--black-dark)"
		}
      `}
		>
			{text && <span>{text}</span>}
			{icon && !customIcon && (
				<BoltIcon
					className={`h-[24px] w-[24px] p-[4px] rounded-full ${
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
