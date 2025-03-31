import { XIcon } from "lucide-react";

function ModalConfirmAction({ isOpen, onClose, dataModal, onConfirmAction }) {
	const { title, text, conferma, annulla } = dataModal;
	return (
		<>
			<div
				id={`ModalConfirmAction-${title}`}
				tabIndex="-1"
				aria-hidden={!isOpen}
				className={`fixed bottom-0 left-0 w-screen h-screen px-[16px] bg-(--black-normal)/50 transition-opacity duration-1000 ease z-1000 ${
					isOpen ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
			></div>
			<div
				className={`fixed left-[16px] bg-white shadow-lg rounded-[24px] w-full transition-all duration-1000 ease flex flex-col gap-[24px] max-w-[calc(100vw-32px)] sm:max-w-[600px] p-[20px] z-1001 ${
					isOpen
						? "top-1/2 -translate-y-1/2"
						: "translate-y-full top-full"
				}`}
			>
				<div className="flex items-center justify-between gap-[8px]">
					<h5 className="body-regular font-medium">{title}</h5>
					<button
						className="p-[2px] border border-solid border-(--black-light-active)"
						onClick={onClose}
					>
						<XIcon className="w-[24px] h-[24px] stroke-(--black-light-active)" />
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
