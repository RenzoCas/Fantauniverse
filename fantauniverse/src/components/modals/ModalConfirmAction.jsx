import NormalButton from "../../atoms/Buttons/NormalButton";
import GhostButton from "../../atoms/Buttons/GhostButton";

function ModalConfirmAction({
	isOpen,
	onClose,
	textConfirmAction,
	onConfirmAction,
}) {
	return (
		<div
			id="ModalConfirmAction"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen px-[16px] bg-(--black-normal)/50 flex justify-center items-center transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-lg w-full transition-transform duration-500 ease flex flex-col items-center max-w-[600px] ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<div className="border-b w-full py-[8px] px-[16px] flex justify-between">
					<h6 className="font-semibold">Conferma operazione</h6>
				</div>
				<div className="py-[16px] px-[16px]">{textConfirmAction}</div>
				<div className="flex gap-[16px] items-center py-[8px] px-[16px]">
					<GhostButton action={onClose} text="Annulla" />
					<NormalButton action={onConfirmAction} text="Conferma" />
				</div>
			</div>
		</div>
	);
}

export default ModalConfirmAction;
