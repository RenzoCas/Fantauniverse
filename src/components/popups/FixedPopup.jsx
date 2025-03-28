import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function FixedPopup({ type, title, message, customIcon = false, children }) {
	const [isClose, setIsClose] = useState(false);
	return (
		<>
			<div
				className={`flex flex-col gap-[8px] bg-white shadow-lg rounded-[16px] p-[16px] fixed mt-auto z-50 border border-(--black-normal)/70 w-[calc(100vw-32px)] md:max-w-[528px] ransition-transform duration-500 ease ${
					isClose ? "translate-y-full" : "translate-y-0"
				} ${isClose ? "bottom-0" : "bottom-[32px]"}`}
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
					<button
						className="absolute top-[8px] right-[8px]"
						onClick={() => setIsClose(true)}
					>
						<XCircleIcon className="h-[24px] w-[24px]" />
					</button>
				</div>
				<p className="body-small font-bold text-(--black-normal)/70 ml-[20px]">
					{message}
				</p>
			</div>
		</>
	);
}

export default FixedPopup;
