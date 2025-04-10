import { useEffect, useState } from "react";
import {
	CheckCircleIcon,
	XCircleIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

function GenericPopup({ isOpen, type, title, message, classOpt }) {
	const [fixedPopupHeight, setFixedPopupHeight] = useState(0);

	useEffect(() => {
		if (isOpen) {
			const fixedPopup = document.querySelector("#fixedPopup");
			if (fixedPopup) {
				const height = fixedPopup.offsetHeight;
				setFixedPopupHeight(height + 16 + 32);
			} else {
				setFixedPopupHeight(32);
			}
		}
	}, [isOpen]);

	return (
		<div
			className={`flex flex-col gap-[8px] bg-white shadow-lg rounded-[16px] p-[16px] border border-(--black-light-active) fixed z-60 transition-transform duration-500 ease w-[calc(100vw-32px)] md:max-w-[528px] lg:self-center
                ${isOpen ? "translate-y-0" : "translate-y-full"} ${
				classOpt ? classOpt : ""
			}`}
			style={{ bottom: isOpen ? `${fixedPopupHeight}px` : "0px" }}
		>
			<div className="flex gap-[4px]">
				{type === "success" ? (
					<CheckCircleIcon className="w-[16px] h-[16px] flex-shrink-0 fill-green-500" />
				) : type === "alert" ? (
					<ExclamationTriangleIcon className="w-[20px] h-[20px] flex-shrink-0 fill-orange-500" />
				) : (
					<XCircleIcon className="h-[16px] w-[16px] flex-shrink-0 fill-(--error-normal)" />
				)}
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
	);
}

export default GenericPopup;
