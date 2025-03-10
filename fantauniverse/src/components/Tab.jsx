import TabButton from "../atoms/Buttons/TabButton";

function Tab({ tabActive, handleTabChange, isAdmin, status }) {
	return (
		<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-light-hover)">
			{status == "STARTED" &&
				!isAdmin(
					<>
						<TabButton
							handleClick={() => handleTabChange("Rules")}
							active={tabActive === "Rules"}
						>
							<p className="body-normal">Regolamento</p>
						</TabButton>
						<TabButton
							handleClick={() => handleTabChange("Ranking")}
							active={tabActive === "Ranking"}
						>
							<p className="body-normal">Classifica</p>
						</TabButton>
						<TabButton
							handleClick={() => handleTabChange("Points")}
							active={tabActive === "Points"}
						>
							<p className="body-normal">Punteggi</p>
						</TabButton>
					</>
				)}
			{status == "PENDING" && isAdmin && (
				<>
					<TabButton
						handleClick={() => handleTabChange("General")}
						active={tabActive === "General"}
					>
						<p className="body-normal">Generale</p>
					</TabButton>
					<TabButton
						handleClick={() => handleTabChange("Players")}
						active={tabActive === "Players"}
					>
						<p className="body-normal">Players</p>
					</TabButton>
					<TabButton
						handleClick={() => handleTabChange("Rules")}
						active={tabActive === "Rules"}
					>
						<p className="body-normal">Regolamento</p>
					</TabButton>
				</>
			)}
		</div>
	);
}

export default Tab;
