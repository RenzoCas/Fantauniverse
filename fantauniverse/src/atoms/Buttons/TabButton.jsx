export default function TabButton({ handleClick, children, active }) {
	return (
		<button
			onClick={handleClick}
			className={`w-full border-b-2 p-[8px] text-(--accent-normal) font-semibold ${
				active ? "border-b-(--accent-normal)" : "border-b-transparent"
			}`}
		>
			{children}
		</button>
	);
}
