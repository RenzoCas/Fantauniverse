function Participant({ participantObj, idx, isRanking, handleClick }) {
	const { id, user, name } = participantObj;
	const { icon, username } = user;
	return (
		<li
			className="flex border-b border-(--black-light) pb-[8px] gap-[16px]"
			onClick={() => handleClick(id)}
		>
			<picture className="rounded-full h-[40px] min-w-[40px] max-w-[40px] flex-shrink-1">
				<img
					src={
						icon != null
							? `data:image/png;base64,${icon}`
							: "https://placehold.co/40x40"
					}
					alt="immagine giocatore"
					className="rounded-full h-[40px] w-[40px] object-cover"
					style={{ cursor: "pointer" }}
				/>
			</picture>
			<div className={`flex flex-col gap-[4px] w-full`}>
				<p className="body-normal font-semibold">{username}</p>
				<p className="body-small font-semibold text-(--black-normal)/70 whitespace-nowrap">
					{name || "nome squadra"}
				</p>
			</div>
			{isRanking && (
				<p className="body-normal font-semibold flex self-center">
					{idx + 1}
				</p>
			)}
		</li>
	);
}

export default Participant;
