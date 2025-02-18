function ButtonHome({ children, action }) {
	return (
		<button
			className="bg-[#1A2D4C]/60 rounded-xl cl-black font-bold w-full py-4 cursor-pointer flex flex-col items-center justify-center gap-2 border-4 border-solid border-[#1A2D4C]/90 hover:bg-[#1A2D4C]"
			onClick={action}
		>
			{children}
		</button>
	);
}

export default ButtonHome;
