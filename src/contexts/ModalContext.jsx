import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

function ModalProvider({ children }) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
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
