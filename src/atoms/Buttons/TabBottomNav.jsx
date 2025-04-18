function TabBottomNav({ handleClick, children, active, text }) {
	return (
		<button
			onClick={handleClick}
			className={`w-full max-w[64px] bg-white flex flex-col gap-[6px] items-center justify-center py-[10px] lg:flex-row lg:max-w-none cursor-pointer ${
				active ? "opacity-100" : "opacity-50"
			}`}
		>
			{children}
			<span className="body-small font-light lg:whitespace-nowrap">
				{text}
			</span>
		</button>
	);
}

export default TabBottomNav;
