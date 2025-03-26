function DayTab({ isActive, day, handleClick }) {
	return (
		<div
			onClick={handleClick}
			className={`p-[10px] rounded-[8px] text-center font-light cursor-pointer transition-all duration-300 ${
				isActive
					? "bg-(--black-normal) text-white"
					: "bg-(--black-light) text-(--black-light-active)"
			}`}
		>
			<h4 className="body-normal">{day.name}</h4>
		</div>
	);
}

export default DayTab;
