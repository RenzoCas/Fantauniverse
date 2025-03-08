import { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

function GenericPopup({ isOpen, type, children }) {
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
			className={`flex items-center gap-[8px] shadow-lg rounded-[16px] p-[24px] fixed z-60 transition-transform duration-500 ease w-[calc(100vw-32px)] md:max-w-[528px]
                ${isOpen ? "translate-y-0" : "translate-y-full"}
                ${type === "success" ? "bg-green-50" : "bg-red-50"}`}
			style={{ bottom: isOpen ? `${fixedPopupHeight}px` : "0px" }}
		>
			{type === "success" ? (
				<CheckIcon className="w-[24px] h-[24px] flex-shrink-0" />
			) : (
				<XMarkIcon className="h-[24px] w-[24px] flex-shrink-0" />
			)}
			{children}
		</div>
	);
}

export default GenericPopup;
