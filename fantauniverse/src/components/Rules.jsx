import { useState } from "react";
import NormalButton from "../atoms/Buttons/NormalButton";
import Rule from "../atoms/Rule";
import ModalAddRules from "./ModalAddRules";

function Rules({ rules, leagueId }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			{rules.length > 0 ? (
				<ul className="flex flex-col gap-[16px]">
					{rules.map((el) => (
						<Rule key={el.id} ruleObj={el} />
					))}
				</ul>
			) : (
				<p>Non ci sono regole, aggiungile.</p>
			)}

			<NormalButton
				text="Aggiungi regola"
				action={() => setIsModalOpen(true)}
			/>

			<ModalAddRules
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				leagueId={leagueId}
			/>
		</>
	);
}

export default Rules;
