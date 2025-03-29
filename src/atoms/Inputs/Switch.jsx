export default function Switch({ enabled, onChange, text, classOpt }) {
	return (
		<label
			className={`flex items-center gap-[8px] cursor-pointer ${
				classOpt ? classOpt : ""
			}`}
		>
			<div className="relative">
				<input
					type="checkbox"
					className="sr-only"
					checked={enabled}
					onChange={onChange}
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
			<span className="font-semibold">{text}</span>
		</label>
	);
}
