export default function TabButton({ handleClick, children, active }) {
	return (
		<button
			onClick={handleClick}
			className={`w-full py-[10px] px-[4px] rounded-[12px] ${
				active
					? "bg-white text-(--black-darker)"
					: "bg-transparent text-(--black-light-active)"
			}`}
		>
			{children}
		</button>
	);
}
