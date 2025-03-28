import { useEffect, useState } from "react";

function CardAccountSettings({ setting, value, onUpdate, viewImage }) {
	const [randomColor, setRandomColor] = useState("#ffffff");
	const randomLightColor = () => {
		const getRandomValue = () => Math.floor(Math.random() * 128) + 128;
		const r = getRandomValue();
		const g = getRandomValue();
		const b = getRandomValue();
		return `#${r.toString(16).padStart(2, "0")}${g
			.toString(16)
			.padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};
	useEffect(() => {
		setRandomColor(randomLightColor());
	}, []);
	return (
		<>
			<div className="flex flex-col gap-[8px] py-[16px] px-[12px] border border-(--black-normal)/50 rounded-[8px] shadow-lg">
				<div className="flex justify-between gap-[8px]">
					{setting === "Icona" ? (
						<>
							<div className="flex flex-col gap-[8px]">
								<h5 className="title-h6 font-semibold">
									{setting}
								</h5>
								<picture className="rounded-lg min-w-[40px] max-w-[40px] h-[40px] overflow-hidden">
									{value == null ? (
										<div
											className={`h-full object-cover`}
											style={{
												backgroundColor: randomColor,
											}}
										></div>
									) : (
										<img
											src={`data:image/png;base64,${value}`}
											alt={`Icona utente`}
											className="h-full object-cover"
										/>
									)}
								</picture>
							</div>
							<div className="flex flex-col gap-[8px]">
								<button
									className="body-small font-light h-fit px-[32px] py-[4px] border rounded-full"
									onClick={onUpdate}
								>
									Modifica
								</button>
								<button
									className="body-small font-light h-fit px-[32px] py-[4px] border rounded-full"
									onClick={viewImage}
								>
									Visualizza immagine
								</button>
							</div>
						</>
					) : (
						<>
							<h5 className="title-h6 font-semibold">
								{setting}
							</h5>
							<button
								className="body-small font-light h-fit px-[32px] py-[4px] border rounded-full"
								onClick={onUpdate}
							>
								Modifica
							</button>
						</>
					)}
				</div>
				{setting !== "Icona" && (
					<p className="body-small">
						{setting === "Password" ? "********" : value}
					</p>
				)}
			</div>
		</>
	);
}

export default CardAccountSettings;
