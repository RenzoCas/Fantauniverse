import { useState } from "react";
import { useLeague } from "../contexts/LeagueContext";
import GenericPopup from "./popups/GenericPopup";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router";

function Participant({ participantObj, idx, isRanking, handleClick }) {
	const navigate = useNavigate();
	const { id, user: participantUser, team } = participantObj;
	const name = team?.name;
	const { icon, username } = participantUser;
	const { user: currentUser } = useUser();
	const { league } = useLeague();
	const { status } = league;
	const [popupData, setPopupData] = useState({
		isOpen: false,
		type: "",
		message: "",
	});

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleViewPartecipant = async () => {
		if (status === "STARTED") {
			await handleClick(id);
		} else if (participantUser.id === currentUser.id) {
			navigate("viewTeam");
		} else {
			showPopup(
				"error",
				"Squadra non visibile!",
				"Potrai visualizzare la squadra degli altri giocatori solo quando la lega sará avviata."
			);
		}
	};

	return (
		<>
			<li
				className="flex border-b border-(--black-light) pb-[8px] gap-[16px]"
				onClick={handleViewPartecipant}
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
						{name || "Squadra non presente."}
					</p>
				</div>
				{isRanking && (
					<p className="body-normal font-semibold flex self-center">
						{idx + 1}
					</p>
				)}
			</li>

			<GenericPopup
				isOpen={popupData.isOpen}
				type={popupData.type}
				title={popupData.title}
				message={popupData.message}
			/>
		</>
	);
}

export default Participant;
