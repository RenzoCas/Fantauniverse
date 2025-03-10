import {
	ChevronDownIcon,
	ChevronUpIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

function Rule({ ruleObj, canEdit, onEdit }) {
	const { name, rule, value } = ruleObj;
	const [expanded, setExpanded] = useState(false);

	return (
		<li className="flex border-b border-(--black-light) pb-[8px] gap-[20px]">
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
			<p className="body-small font-semibold whitespace-nowrap ml-auto">
				{value} ptn.
			</p>
		</li>
	);
}

export default Rule;
