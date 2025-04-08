import { createContext, useContext, useState, useEffect } from "react";

const ModalContext = createContext();

function ModalProvider({ children }) {
	const [isOpenBackdrop, setIsOpen] = useState(false);

	const openBackdrop = () => {
		setIsOpen(true);
	};

	const closeBackdrop = () => {
		setIsOpen(false);
	};

	// Disabilita lo scroll quando la modale è aperta
	useEffect(() => {
		if (isOpenBackdrop) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		// Cleanup per ripristinare l'overflow quando il componente viene smontato
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpenBackdrop]);

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
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
}

export { ModalProvider, useModal };
