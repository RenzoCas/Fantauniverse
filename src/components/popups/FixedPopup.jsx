import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";

function FixedPopup({ type, title, message, customIcon = false, children }) {
	return (
		<>
			<div
				className={`flex-col gap-[8px] bg-white rounded-[16px] p-[16px] mt-auto border border-(--black-light-active)/70 w-[calc(100vw-32px)] md:max-w-[528px] ransition-opacity duration-500 ease`}
			>
				<div className="flex items-center gap-[12px]">
					{!customIcon && (
						<>
							{type === "success" ? (
								<CheckCircleIcon className="w-[24px] h-[24px] flex-shrink-0 fill-green-500" />
							) : (
								<XCircleIcon className="h-[24px] w-[24px] flex-shrink-0 fill-(--error-normal) border-0" />
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
				<p className="body-small text-(--black-normal)/70 ml-[32px]">
					{message}
				</p>
			</div>
		</>
	);
}

export default FixedPopup;
