import TabButton from "../atoms/Buttons/TabButton";

function Tab({ tabActive, handleTabChange, isAdmin, status }) {
	return (
		<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-light-hover)">
			<TabButton
				handleClick={() => handleTabChange("Regolamento")}
				active={tabActive === "Regolamento"}
			>
				<p className="body-normal">Regolamento</p>
			</TabButton>
			{status == "STARTED" && (
				<TabButton
					handleClick={() => handleTabChange("Classifica")}
					active={tabActive === "Classifica"}
				>
					<p className="body-normal">Classifica</p>
				</TabButton>
			)}
			{isAdmin && (
				<TabButton
					handleClick={() => handleTabChange("Players")}
					active={tabActive === "Players"}
				>
					<p className="body-normal">Players</p>
				</TabButton>
			)}
		</div>
	);
}

export default Tab;
