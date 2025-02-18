function ButtonPrimary({ children, action }) {
	return (
		<button
			className="bg-[#ffcd66] rounded-xl cl-black font-bold py-3 px-6 cursor-pointer"
			onClick={action}
		>
			{children}
		</button>
	);
}

export default ButtonPrimary;
