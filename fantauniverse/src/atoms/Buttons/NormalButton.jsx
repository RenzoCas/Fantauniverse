import { BoltIcon } from "@heroicons/react/24/outline";

export default function NormalButton({
	text,
	action,
	disabled = false,
	icon = true,
}) {
	return (
		<button
			onClick={action}
			disabled={disabled}
			className={`group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-white
        ${
			disabled
				? "bg-(--black-light) text-(--black-normal)/25 cursor-not-allowed"
				: "bg-(--black-normal) text-(--white) hover:bg-(--black-dark)"
		}
      `}
		>
			<span>{text}</span>
			{icon && (
				<BoltIcon
					className={`h-[24px] w-[24px] p-[4px] rounded-full ${
						disabled
							? "opacity-[25]"
							: "text-(--black-normal) bg-(--black-light) group-hover:bg-(--black-normal) group-hover:text-white"
					}`}
				/>
			)}
		</button>
	);
}
