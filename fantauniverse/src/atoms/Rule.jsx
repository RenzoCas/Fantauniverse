import { TrashIcon } from "@heroicons/react/24/outline";

function Rule({ ruleObj, onDelete, isAdmin }) {
	const { name, rule, malus, value, id } = ruleObj;

	return (
		<li
			className={`flex justify-between items-center p-[12px] rounded-[8px] border shadow-lg`}
		>
			<div className="flex-1">
				<p className="font-medium text-(--black-normal)">{name}</p>
				<p className="text-sm text-(--black-normal)/70">{rule}</p>
			</div>
			<div className="flex gap-[8px] items-center">
				<p className={`font-bold ${malus && "text-(--error-normal)"}`}>
					{malus ? `-${value}` : value}
				</p>
				{isAdmin && (
					<button onClick={() => onDelete(id)}>
						<TrashIcon className="w-[24px] h-[24px]" />
					</button>
				)}
			</div>
		</li>
	);
}

export default Rule;
