import { useEffect, useState } from "react";
import { useLeague } from "../contexts/LeagueContext";
import GenericPopup from "./popups/GenericPopup";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router";

function Participant({ participantObj, idx, isRanking, handleClick }) {
	const navigate = useNavigate();
	const { id, user: participantUser, team, points } = participantObj;
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
	const [randomColor, setRandomColor] = useState("#ffffff");

	const showPopup = (type, title, message) => {
		setPopupData({ isOpen: true, type, title, message });
		setTimeout(
			() => setPopupData({ isOpen: false, type, title, message }),
			2000
		);
	};

	const handleViewPartecipant = async () => {
		if (status != "NOT_STARTED") {
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
			<li
				className="flex items-center border-b border-(--black-light) pb-[8px] gap-[20px]"
				onClick={handleViewPartecipant}
			>
				{isRanking && (
					<div
						className={`flex items-center justify-center min-w-[48px] h-[48px] rounded-[4px] border border-solid ${
							idx === 0
								? "bg-gradient-to-b from-[#DCC939] to-[#AC9D30] shadow-[inset_0_2px_4px_#C1B030] border-[#C1B030] text-white"
								: idx === 1
								? "bg-gradient-to-b from-[#DCDCDC] to-[#BBBBBB] shadow-[inset_0_2px_4px_#DCDCDC] border-[#DCDCDC] text-white"
								: idx === 2
								? "bg-gradient-to-b from-[#E08D40] to-[#A06126] shadow-[inset_0_2px_4px_#E08D40] border-[#E08D40] text-white"
								: "bg-white text-(--black-normal) border-(--black-light-active)"
						}`}
					>
						<p className="body-normal font-black">{idx + 1}&deg;</p>
					</div>
				)}
				<picture className="rounded-[3px] h-[48px] min-w-[48px] max-w-[48px]">
					{icon == null ? (
						<div
							className={`rounded-[3px] h-[48px] w-[48px] object-cover`}
							style={{ backgroundColor: randomColor }}
						></div>
					) : (
						<img
							src={`data:image/png;base64,${icon}`}
							alt={`immagine giocatore`}
							className="rounded-[3px] h-[48px] w-[48px] object-cover cursor-pointer"
						/>
					)}
				</picture>
				<div className={`flex flex-col gap-[4px] w-full`}>
					<h3 className="body-normal font-semibold break-words">
						{username}
					</h3>
					<p className="body-small font-semibold text-(--black-normal)/70 break-words">
						{name || "Squadra non presente."}
					</p>
				</div>
				<p className="body-normal font-semibold whitespace-nowrap">
					{points} pnt.
				</p>
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
