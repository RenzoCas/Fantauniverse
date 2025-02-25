export default function Lega({ icona, nome, numPartecipanti }) {
	return (
		<li className="flex gap-[10px] p-[16px] border border-(--black-light) rounded-[16px] bg-white">
			<img
				src={icona}
				alt={`Logo lega ${nome}`}
				className="rounded-[8px]"
			/>
			<div className="flex flex-col gap-[6px]">
				<h4 className="font-medium text-(--black-darker)">{nome}</h4>
				<p className="body-small text-(--black-light-active)">
					{numPartecipanti} squadre iscritte
				</p>
			</div>
		</li>
	);
}
