function Radio({ name, id, value, handleChange, label, checked }) {
	return (
		<div className="flex gap-[8px] items-center">
			<input
				type="radio"
				name={name}
				id={id}
				value={value}
				onChange={handleChange}
				checked={checked}
				className="w-4 h-4 accent-(--black-normal)"
			/>
			<label htmlFor={id}>{label}</label>
		</div>
	);
}

export default Radio;
