import TabButton from "../atoms/Buttons/TabButton";
import { useLeague } from "../contexts/LeagueContext";

function TabDashboard({ tabActive, handleTabChange }) {
	const { myLeagues } = useLeague();
	const statuses = [...new Set(myLeagues.map((league) => league.status))];

	return (
		<div className="flex gap-[8px] p-[4px] rounded-[16px] bg-(--black-light-hover)">
			{statuses.includes("PENDING") && (
				<TabButton
					handleClick={() => handleTabChange("PENDING")}
					active={tabActive === "PENDING"}
				>
					<p className="body-normal">Create</p>
				</TabButton>
			)}
			{statuses.includes("NOT_STARTED") && (
				<TabButton
					handleClick={() => handleTabChange("NOT_STARTED")}
					active={tabActive === "NOT_STARTED"}
				>
					<p className="body-normal">Pubblicate</p>
				</TabButton>
			)}
			{statuses.includes("STARTED") && (
				<TabButton
					handleClick={() => handleTabChange("STARTED")}
					active={tabActive === "STARTED"}
				>
					<p className="body-normal">Avviate</p>
				</TabButton>
			)}
			{statuses.includes("FINISHED") && (
				<TabButton
					handleClick={() => handleTabChange("FINISHED")}
					active={tabActive === "FINISHED"}
				>
					<p className="body-normal">Terminate</p>
				</TabButton>
			)}
		</div>
	);
}

export default TabDashboard;
