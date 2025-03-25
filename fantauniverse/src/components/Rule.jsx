import {
	ChevronDownIcon,
	ChevronUpIcon,
	MinusCircleIcon,
	PencilSquareIcon,
	PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

function Rule({ ruleObj, canEdit, onEdit, isAddPoints }) {
	const { name, rule, value } = ruleObj;
	const [expanded, setExpanded] = useState(false);
	const [isSelected, setIsSelected] = useState(false);

	return (
		<li
			className={`flex border-b border-(--black-light) pb-[8px] gap-[16px] transform transition-all duration-300 has-disabled:opacity-[0.5] ${
				isSelected && "shadow-lg border p-[8px] rounded-[8px]"
			}`}
		>
			{canEdit && (
				<button className="flex" onClick={() => onEdit(ruleObj)}>
					<PencilSquareIcon className="h-[20px] w-[20px]" />
				</button>
			)}
			<div className={`flex flex-col gap-[4px]`}>
				<p className="body-small font-semibold">{name}</p>
				<div className="flex gap-[4px] items-end">
					<p
						className={`body-small text-(--black-normal)/70 transition-all ${
							expanded ? "line-clamp-none" : "line-clamp-2"
						}`}
					>
						{rule}
					</p>
					{rule.length > 80 && (
						<button
							className="flex"
							onClick={() => setExpanded(!expanded)}
						>
							{expanded ? (
								<ChevronUpIcon className="h-[16px] w-[16px] stroke-2" />
							) : (
								<ChevronDownIcon className="h-[16px] w-[16px] stroke-2" />
							)}
						</button>
					)}
				</div>
			</div>
			<div className="flex gap-[8px] ml-auto">
				<p className="body-small font-semibold whitespace-nowrap">
					{value} ptn.
				</p>
				{isAddPoints && (
					<>
						{isSelected ? (
							<button
								className="flex self-center"
								onClick={() => setIsSelected(false)}
							>
								<MinusCircleIcon className="h-[20px] w-[20px]" />
							</button>
						) : (
							<button
								className="flex self-center"
								onClick={() => setIsSelected(true)}
							>
								<PlusCircleIcon className="h-[20px] w-[20px]" />
							</button>
						)}
					</>
				)}
			</div>
		</li>
	);
}

export default Rule;
