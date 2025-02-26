function Select({ name, id, options, value, handleChange }) {
	return (
		<select
			name={name}
			id={id}
			value={value}
			onChange={handleChange}
			className="w-full px-[24px] py-[10px] text-(--black-normal) rounded-2xl border-2 border-transparent placeholder-(--black-normal) bg-(--black-light-hover) focus:border-solid focus:border-[2px] focus:border-(--black-normal)"
		>
			{options.map((opt) => (
				<option key={opt.value} value={opt.value} className="text-red">
					{opt.text}
				</option>
			))}
		</select>
	);
}

export default Select;
