function ButtonPrimary({ children, action }) {
	return (
		<button
			className="bg-[#ffcd66] rounded-xl cl-black font-bold py-4 px-8 cursor-pointer"
			onClick={action}
		>
			{children}
		</button>
	);
}

export default ButtonPrimary;
