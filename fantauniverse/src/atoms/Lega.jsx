export default function Lega({ icon, name, participants }) {
	return (
		<li className="flex gap-[10px] p-[16px] border border-(--black-light) rounded-[16px] bg-white">
			<img
				src={icon || "https://placehold.co/60x60"}
				alt={`Logo lega ${name}`}
				className="rounded-[8px]"
			/>
			<div className="flex flex-col gap-[6px]">
				<h4 className="font-medium text-(--black-darker)">{name}</h4>
				<p className="body-small text-(--black-light-active)">
					{participants}{" "}
					{participants > 1 ? "squadre iscritte" : "squadra iscritta"}
				</p>
			</div>
		</li>
	);
}
