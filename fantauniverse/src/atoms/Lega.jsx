import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Lega({ lega }) {
	const { id, icon, name, admin, participants } = lega;
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/app/league/${id}`, { state: { lega } });
	};

	return (
		<li
			className="flex gap-2.5 p-4 border border-gray-300 rounded-lg bg-white cursor-pointer"
			onClick={handleClick}
		>
			<img
				src={icon || "https://placehold.co/60x60"}
				alt={`Logo lega ${name}`}
				className="rounded-lg"
			/>
			<div className="flex flex-col gap-1.5 w-full">
				<div className="flex justify-between items-center">
					<h4 className="font-medium text-gray-800">{name}</h4>
					{admin?.id === user?.id && (
						<WrenchScrewdriverIcon className="w-5 h-5" />
					)}
				</div>
				<p className="text-sm text-gray-600">
					{participants.length} partecipanti
				</p>
			</div>
		</li>
	);
}
