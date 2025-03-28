import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

function FixedPopup({ type, title, message, customIcon = false, children }) {
	return (
		<>
			<div
				className={`flex flex-col gap-[8px] bg-white shadow-lg rounded-[16px] p-[16px] sticky bottom-[32px] mt-auto z-50 border border-(--black-normal)/70 w-[calc(100vw-32px)] md:max-w-[528px]`}
			>
				<div className="flex items-center gap-[4px]">
					{!customIcon && (
						<>
							{type === "success" ? (
								<CheckCircleIcon className="w-[16px] h-[16px] flex-shrink-0 fill-green-500" />
							) : (
								<XCircleIcon className="h-[16px] w-[16px] flex-shrink-0 fill-(--error-normal) border-0" />
							)}
						</>
					)}
					{customIcon && children}
					<div className="flex flex-col gap-[8px]">
						<h6 className="body-normal font-semibold text-(--black-normal)">
							{title}
						</h6>
					</div>
				</div>
				<p className="body-small font-bold text-(--black-normal)/70 ml-[20px]">
					{message}
				</p>
			</div>
		</>
	);
}

export default FixedPopup;
