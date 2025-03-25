import TabButton from "../atoms/Buttons/TabButton";

function Tab({ tabActive, handleTabChange, isAdmin, status }) {
	return (
		<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-light-hover)">
			{isAdmin ? (
				status == "PENDING" ? (
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
							<p className="body-normal">Regole</p>
						</TabButton>
					</>
				) : status == "NOT_STARTED" ? (
					<>
						<TabButton
							handleClick={() => handleTabChange("General")}
							active={tabActive === "General"}
						>
							<p className="body-normal">Generale</p>
						</TabButton>
						<TabButton
							handleClick={() => handleTabChange("Participants")}
							active={tabActive === "Participants"}
						>
							<p className="body-normal">Giocatori</p>
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
							<p className="body-normal">Regole</p>
						</TabButton>
					</>
				) : (
					status == "STARTED" && (
						<>
							<TabButton
								handleClick={() => handleTabChange("General")}
								active={tabActive === "General"}
							>
								<p className="body-normal">Generale</p>
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
							<TabButton
								handleClick={() => handleTabChange("Rules")}
								active={tabActive === "Rules"}
							>
								<p className="body-normal">Regole</p>
							</TabButton>
						</>
					)
				)
			) : status == "NOT_STARTED" ? (
				<>
					<TabButton
						handleClick={() => handleTabChange("Participants")}
						active={tabActive === "Participants"}
					>
						<p className="body-normal">Giocatori</p>
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
						<p className="body-normal">Regole</p>
					</TabButton>
				</>
			) : (
				<>
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
					<TabButton
						handleClick={() => handleTabChange("Rules")}
						active={tabActive === "Rules"}
					>
						<p className="body-normal">Regole</p>
					</TabButton>
				</>
			)}
		</div>
	);
}

export default Tab;
