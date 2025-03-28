import NormalButton from "../../atoms/Buttons/NormalButton";
import GhostButton from "../../atoms/Buttons/GhostButton";

function ModalConfirmAction({
	isOpen,
	onClose,
	text,
	disclaimer,
	onConfirmAction,
	isDisabled = false,
}) {
	return (
		<div
			id="ModalConfirmAction"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen px-[16px] bg-(--black-normal)/50 flex justify-center items-center transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
			onClick={onClose}
		>
			<div
				className={`bg-white shadow-lg rounded-[12px] w-full transition-transform duration-500 ease flex flex-col gap-[16px] items-center text-center max-w-[600px] p-[16px] z-1001 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<h5 className="body-normal font-semibold">{text}</h5>
				{disclaimer && <p className="body-small">{disclaimer}</p>}
				{isDisabled ? (
					<NormalButton
						action={onClose}
						text="Conferma"
						icon={false}
					/>
				) : (
					<div className="flex gap-[16px] items-center">
						<GhostButton
							action={onClose}
							text="Annulla"
							icon={false}
						/>
						<NormalButton
							action={onConfirmAction}
							text="Conferma"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default ModalConfirmAction;
