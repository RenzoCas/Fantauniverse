import { BookOpenIcon } from "@heroicons/react/24/outline";

function Rule({ ruleObj }) {
	const { name, rule, malus, value } = ruleObj;

	return (
		<li className="flex gap-[8px]">
			<BookOpenIcon className="w-[24px] h-[24px]" />
			<div className="flex flex-col gap-[8px] w-full">
				<div className="flex justify-between gap-[8px]">
					<h6 className="text-(--black-normal)">{name}</h6>
					<p
						className={`body-normal ${
							malus
								? "text-(--error-normal)"
								: "text-(--black-normal)"
						}`}
					>
						{malus ? `-${value}` : `+${value}`}
					</p>
				</div>
				<p className="body-small text-(--black-normal)">{rule}</p>
			</div>
		</li>
	);
}

export default Rule;
