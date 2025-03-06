function GenericPopup({ isOpen, children, background }) {
	return (
		<div
			className={`flex items-center gap-[8px] shadow-lg rounded-[16px] p-[24px] fixed transition-transform duration-500 ease z-100 w-[calc(100vw-32px)] md:max-w-[528px] ${
				isOpen
					? "transform translate-y-0 bottom-[32px]"
					: "transform translate-y-full bottom-0"
			} bg-${background}`}
		>
			{children}
		</div>
	);
}

export default GenericPopup;
