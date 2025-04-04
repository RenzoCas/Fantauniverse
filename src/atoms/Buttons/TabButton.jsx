export default function TabButton({ handleClick, children, active }) {
	return (
		<button
			onClick={handleClick}
			className={`w-full py-[10px] px-[4px] rounded-[12px] lg:px-[24px] ${
				active
					? "bg-white text-(--black-darker) border border-(--black-light-hover)"
					: "bg-transparent text-(--black-light-active)"
			}`}
			type="button"
		>
			{children}
		</button>
	);
}
