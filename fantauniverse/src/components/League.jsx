import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Lega({ league }) {
	const navigate = useNavigate();
	const { id, name, icon, isAdmin, numberParticipants } = league;

	const handleClick = () => {
		navigate(`league/${id}`, {
			state: { league, deleteLeague: null },
			replace: true,
		});
	};

	return (
		<li
			className="flex gap-2.5 p-4 border border-gray-300 rounded-lg bg-white cursor-pointer"
			onClick={handleClick}
		>
			<picture className="rounded-lg min-w-[60px] max-w-[60px] h-[60px] overflow-hidden">
				<img
					src={
						icon != null
							? `data:image/png;base64,${icon}`
							: "https://placehold.co/60x60"
					}
					alt={`Logo lega ${name}`}
					className="h-full object-cover"
				/>
			</picture>

			<div className="flex flex-col gap-1.5 w-full">
				<div className="flex justify-between items-center">
					<h4 className="font-medium text-gray-800">{name}</h4>
					{isAdmin && <WrenchScrewdriverIcon className="w-5 h-5" />}
				</div>
				<p className="text-sm text-gray-600">
					{numberParticipants} partecipanti
				</p>
			</div>
		</li>
	);
}
