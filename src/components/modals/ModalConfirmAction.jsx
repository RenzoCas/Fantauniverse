import { XIcon } from "lucide-react";
import { useModal } from "../../contexts/ModalContext";
import { useEffect } from "react";

function ModalConfirmAction({ isOpen, onClose, dataModal, onConfirmAction }) {
	const { title, text, conferma, annulla } = dataModal;
	const { openModal, closeModal } = useModal();
	useEffect(() => {
		if (isOpen) {
			openModal();
		} else {
			closeModal();
		}
	}, [isOpen]);
	return (
		<>
			<div
				className={`absolute left-[16px] lg:left-1/2 lg:-translate-x-1/2 bg-white shadow-lg rounded-[24px] w-full transition-all duration-300 ease flex flex-col gap-[24px] lg:max-w-[500px] p-[20px] z-1001 ${
					isOpen
						? "scale-100 opacity-100 bottom-1/2 translate-y-1/2 visible delay-150"
						: "scale-80 opacity-30 bottom-[100px] invisible"
				}`}
			>
				<div className="flex items-center justify-between gap-[8px]">
					<h5 className="body-regular font-medium">{title}</h5>
					<button
						className="p-[2px] border border-solid border-(--black-light-active)"
						onClick={onClose}
					>
						<XIcon className="w-[24px] h-[24px] stroke-(--black-light-active) flex-shrink-0" />
					</button>
				</div>
				<p className="body-normal font-regular">{text}</p>
				<div className="flex gap-[16px] items-center self-end">
					<button
						onClick={onClose}
						className="px-[16px] py-[8px] border border-solid border-(--black-light-active) body-small text-(--black-light-active) rounded-full"
					>
						{annulla}
					</button>
					<button
						onClick={onConfirmAction}
						className="px-[16px] py-[8px] bg-(--black-normal) body-small text-white rounded-full"
					>
						{conferma}
					</button>
				</div>
			</div>
		</>
	);
}

export default ModalConfirmAction;
