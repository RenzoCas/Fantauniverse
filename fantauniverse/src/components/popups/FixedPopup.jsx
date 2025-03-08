function FixedPopup({ children, background }) {
	return (
		<div
			id="fixedPopup"
			className={`flex items-center gap-[8px] shadow-lg rounded-[16px] p-[24px] sticky bottom-[32px] mt-auto z-50 w-[calc(100vw-32px)] md:max-w-[528px] bg-${background}`}
		>
			{children}
		</div>
	);
}

export default FixedPopup;
