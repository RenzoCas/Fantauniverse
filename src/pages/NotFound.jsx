import { useNavigate } from "react-router";
import NormalButton from "../atoms/Buttons/NormalButton";

export default function NotFound() {
	const navigate = useNavigate();
	return (
		<main className="max-w-3xl mx-auto py-8 px-4 lg:py-16 lg:px-6 flex flex-col gap-4 justify-center items-center min-h-dvh">
			<h1 className="font-bold">404</h1>
			<h2 className="title-h2">Ti sei perso!</h2>
			<img
				src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
				alt="404 gif"
				className="h-full w-full"
				loading="lazy"
			/>
			<p className="body-regular text-center font-semibold">
				La pagina che cercavi non &egrave; disponibile.
			</p>
			<NormalButton
				text="Torna alla home"
				action={() => navigate("/")}
				icon={false}
			/>
		</main>
	);
}
