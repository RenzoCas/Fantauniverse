import { BoltIcon } from "@heroicons/react/24/outline";

export default function GhostButton({
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
			className={`group flex items-center justify-center gap-[8px] rounded-full px-[24px] py-[12px] text-(--black-normal) ${classOpt}
                ${
					disabled
						? "text-(--black-normal)/25 cursor-not-allowed"
						: "text-(--black-normal) hover:bg-(--black-light)"
				}
            `}
		>
			{text && <span>{text}</span>}

			{icon && !customIcon && (
				<BoltIcon
					className={`h-[24px] w-[24px] p-[4px] rounded-full ${
						disabled
							? "bg-(--black-light)/25 opacity-[25]"
							: "text-(--black-normal) bg-(--black-light) group-hover:bg-(--black-light)"
					}`}
				/>
			)}

			{icon && customIcon && children}
		</button>
	);
}
