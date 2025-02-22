import { BoltIcon } from "@heroicons/react/24/outline";

export default function GhostButton({
	text,
	action,
	disabled = false,
	icon = true,
}) {
	return (
		<button
			onClick={action}
			disabled={disabled}
			className={`group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-(--black-normal)
        ${
			disabled
				? "text-(--black-normal)/25 cursor-not-allowed"
				: "text-(--black-normal) hover:bg-(--black-light)"
		}
      `}
		>
			<span>{text}</span>

			{icon && (
				<BoltIcon
					className={`h-[24px] w-[24px] p-[4px] rounded-full ${
						disabled
							? "bg-(--black-light)/25 opacity-[25]"
							: "text-(--black-normal) bg-(--black-light) group-hover:bg-(--black-light)"
					}`}
				/>
			)}
		</button>
	);
}
