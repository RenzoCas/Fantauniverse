import { XMarkIcon } from "@heroicons/react/24/outline";
import Lega from "../League";

function ModalSearchLeague({ isOpen, onClose, leaguesFound }) {
	return (
		<div
			id="modalLeague"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className={`fixed bottom-0 left-0 w-screen h-screen bg-(--black-normal)/50 flex justify-center items-end md:items-center transition-opacity duration-500 ease z-1000 ${
				isOpen ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<div
				className={`bg-white shadow-lg rounded-t-[12px] px-[16px] pb-[16px] md:py-[24px] w-full transition-transform duration-500 ease flex flex-col gap-[4px] max-h-[calc(100dvh-100px)] overflow-y-auto ${
					isOpen ? "translate-y-0" : "translate-y-full"
				} md:max-w-[600px] md:rounded-lg md:items-center md:justify-center`}
			>
				<div className="flex item-center justify-between gap-[8px] sticky top-0 py-[12px] bg-white w-full">
					<h4 className="body-regular font-semibold">
						Leghe trovate:
					</h4>
					<button onClick={onClose}>
						<XMarkIcon className="h-[24px] w-[24px]" />
					</button>
				</div>

				<ul className="flex flex-col gap-[10px]">
					{leaguesFound.map((el) => (
						<Lega key={el.id} league={el} />
					))}
				</ul>
			</div>
		</div>
	);
}

export default ModalSearchLeague;
