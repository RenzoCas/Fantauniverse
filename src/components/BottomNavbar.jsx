import { ChartLine, Newspaper, ShieldHalf, Trophy, Users } from "lucide-react";
import TabBottomNav from "../atoms/Buttons/TabBottomNav";
import { useLeague } from "../contexts/LeagueContext";

function BottomNavbar({ tabActive, handleTabChange }) {
	const { league } = useLeague();
	const { status, isRegistered } = league;
	return (
		<nav className="sticky bottom-[24px] mt-auto py-[5px] px-[20px] bg-white border border-solid border-(--black-light-hover) shadow-lg rounded-[12px] flex gap-[12px]">
			<TabBottomNav
				text="Info"
				active={tabActive == "General"}
				handleClick={() => handleTabChange("General")}
			>
				<Newspaper className="h-[20px] w-[20px]" />
			</TabBottomNav>
			{status === "NOT_STARTED" ? (
				<TabBottomNav
					text="Giocatori"
					active={tabActive == "Participants"}
					handleClick={() => handleTabChange("Participants")}
				>
					<Users className="h-[20px] w-[20px]" />
				</TabBottomNav>
			) : (
				<TabBottomNav
					text="Classifica"
					active={tabActive == "Ranking"}
					handleClick={() => handleTabChange("Ranking")}
				>
					<Trophy className="h-[20px] w-[20px]" />
				</TabBottomNav>
			)}
			{status != "NOT_STARTED" && (
				<TabBottomNav
					text="Punteggi"
					active={tabActive == "Points"}
					handleClick={() => handleTabChange("Points")}
				>
					<ChartLine className="h-[20px] w-[20px]" />
				</TabBottomNav>
			)}

			{isRegistered && (
				<TabBottomNav
					text="Il mio team"
					active={tabActive == "MyTeam"}
					handleClick={() => handleTabChange("MyTeam")}
				>
					<ShieldHalf className="h-[20px] w-[20px]" />
				</TabBottomNav>
			)}
		</nav>
	);
}

export default BottomNavbar;
