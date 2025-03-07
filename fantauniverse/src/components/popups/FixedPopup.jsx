function FixedPopup({ children, background }) {
	return (
		<div
			id="fixedPopup"
			className={`flex items-center gap-[8px] shadow-lg rounded-[16px] p-[24px] fixed bottom-[32px] z-100 w-[calc(100vw-32px)] md:max-w-[528px] bg-${background}`}
		>
			{children}
		</div>
	);
}

export default FixedPopup;
