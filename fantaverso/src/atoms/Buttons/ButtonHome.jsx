function ButtonHome({ children, action }) {
	return (
		<button
			className="bg-[#1A2D4C] rounded-lg cl-black font-bold w-full py-4 cursor-pointer flex flex-col items-center justify-center gap-2"
			onClick={action}
		>
			{children}
		</button>
	);
}

export default ButtonHome;
