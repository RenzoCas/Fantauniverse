import { useEffect } from "react";

export default function FocusModal(ref, isActive) {
	useEffect(() => {
		if (!isActive || !ref.current) return;

		const focusableSelectors =
			'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

		let firstEl, lastEl;

		const focusFirstElement = () => {
			const focusableEls =
				ref.current.querySelectorAll(focusableSelectors);
			if (focusableEls.length === 0) {
				return;
			}

			firstEl = focusableEls[0];
			lastEl = focusableEls[focusableEls.length - 1];

			firstEl?.focus();
		};

		focusFirstElement();

		const observer = new MutationObserver(() => {
			focusFirstElement();
		});

		observer.observe(ref.current, {
			subtree: true,
			attributes: true,
			attributeFilter: ["disabled"],
		});

		const trapFocus = (e) => {
			if (e.key !== "Tab") return;

			const activeEl = document.activeElement;

			if (!ref.current.contains(activeEl)) {
				e.preventDefault();
				firstEl?.focus();
				return;
			}

			if (e.shiftKey && activeEl === firstEl) {
				e.preventDefault();
				lastEl?.focus();
			} else if (!e.shiftKey && activeEl === lastEl) {
				e.preventDefault();
				firstEl?.focus();
			}
		};

		document.addEventListener("keydown", trapFocus);

		return () => {
			observer.disconnect();
			document.removeEventListener("keydown", trapFocus);
		};
	}, [ref, isActive]);
}
