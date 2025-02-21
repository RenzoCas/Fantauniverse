import { NavLink } from "react-router-dom";

export default function NotFound() {
	return (
		<main className="max-w-3xl mx-auto py-8 px-4 lg:py-16 lg:px-6 flex flex-col gap-4 min-h-[calc(100dvh-64px)]">
			<h1 className="text-(--primary) text-center">
				404 Pagina Not found
			</h1>
			<NavLink to="/" className="text-(--primary) text-center underline">
				Torna alla home
			</NavLink>
		</main>
	);
}
