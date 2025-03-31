import { ChartLine, Newspaper, ShieldHalf, Trophy } from "lucide-react";
import TabBottomNav from "../atoms/Buttons/TabBottomNav";

function BottomNavbar({ tabActive, handleTabChange }) {
	return (
		<nav className="sticky bottom-[16px] py-[5px] px[-20px] bg-white border border-solid border-(--black-light-hover) shadow-lg rounded-[12px] flex gap-[20px]">
			<TabBottomNav
				text="Info"
				active={tabActive == "General"}
				handleClick={() => handleTabChange("General")}
			>
				<Newspaper className="h-[20px] w-[20px]" />
			</TabBottomNav>
			<TabBottomNav
				text="Classifica"
				active={tabActive == "Ranking"}
				handleClick={() => handleTabChange("Ranking")}
			>
				<Trophy className="h-[20px] w-[20px]" />
			</TabBottomNav>
			<TabBottomNav
				text="Punteggi"
				active={tabActive == "Days"}
				handleClick={() => handleTabChange("Days")}
			>
				<ChartLine className="h-[20px] w-[20px]" />
			</TabBottomNav>
			<TabBottomNav
				text="Team"
				active={tabActive == "Team"}
				handleClick={() => handleTabChange("Team")}
			>
				<ShieldHalf className="h-[20px] w-[20px]" />
			</TabBottomNav>
		</nav>
	);
}

export default BottomNavbar;
