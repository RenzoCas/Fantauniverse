export default function Switch({ enabled, onChange, text, classOpt }) {
	return (
		<label
			className={`flex items-center gap-[8px] cursor-pointer ${
				classOpt ? classOpt : ""
			}`}
		>
			<div className="group relative rounded-full focus-within:ring-2 focus-within:ring-(--black-normal)">
				<input
					type="checkbox"
					className="sr-only"
					checked={enabled}
					onChange={onChange}
					tabIndex="0"
				/>
				<div
					className={`w-[44px] h-[24px] rounded-full transition ${
						enabled ? "bg-(--black-normal)" : "bg-[#E2E8F0]"
					}`}
				></div>
				<div
					className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full transition ${
						enabled ? "translate-x-5" : ""
					}`}
				></div>
			</div>
			<span className="body-small font-medium">{text}</span>
		</label>
	);
}
