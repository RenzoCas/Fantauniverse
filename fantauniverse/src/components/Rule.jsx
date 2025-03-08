import { TrashIcon } from "@heroicons/react/24/outline";

function Rule({ ruleObj, onDelete, isAdmin }) {
	const { name, rule, malus, value, id } = ruleObj;

	return (
		<li className={`flex flex-col rounded-[8px] border shadow-lg`}>
			<div className="flex justify-end py-[8px] px-[16px] border-b border-b-(--black-light-hover)">
				<p className="body-small text-(--black-normal)">
					<span className="font-bold">{value} </span>
					{malus ? "Malus" : "Bonus"}
				</p>
			</div>
			<div className="flex gap-[16px] py-[8px] px-[16px] items-center">
				<div className="flex flex-col gap-[8px]">
					<p className="font-bold body-normal">{name}</p>
					<p className={`body-normal`}>{rule}</p>
				</div>
				{isAdmin && (
					<button onClick={() => onDelete(id)} className="ml-auto">
						<TrashIcon className="w-[24px] h-[24px]" />
					</button>
				)}
			</div>
		</li>
	);
}

export default Rule;
