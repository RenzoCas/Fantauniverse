import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

function ModalProvider({ children }) {
	const [isOpenBackdrop, setIsOpen] = useState(false);

	const openBackdrop = () => {
		setIsOpen(true);
	};

	const closeBackdrop = () => {
		setIsOpen(false);
	};

	return (
		<ModalContext.Provider
			value={{ isOpenBackdrop, openBackdrop, closeBackdrop }}
		>
			{children}
		</ModalContext.Provider>
	);
}

function useModal() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within an ModalProvider");
	}
	return context;
}

export { ModalProvider, useModal };
