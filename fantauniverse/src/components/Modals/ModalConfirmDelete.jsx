import { XMarkIcon } from "@heroicons/react/24/outline";

function ModalConfermDelete({ isOpen, onClose, children }) {
	return (
		<div
			id="ModalConfirmDelete"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end transition-opacity duration-500 ease ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-t-lg p-[16px] w-full transition-transform duration-500 ease flex flex-col gap-[24px] ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<button onClick={onClose} className="flex self-end">
					<XMarkIcon className="h-[20px] w-[20px]" />
				</button>
			</div>
			{children}
		</div>
	);
}

export default ModalConfermDelete;
