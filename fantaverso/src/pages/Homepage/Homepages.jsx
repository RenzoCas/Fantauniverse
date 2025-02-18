import { useNavigate } from "react-router";
import ButtonHome from "../../atoms/Buttons/ButtonHome";
import ButtonPrimary from "../../atoms/Buttons/ButtonPrimary";

export default function Homepage() {
	const navigate = useNavigate();

	const goToRules = () => {
		navigate("/regolamento");
	};
	const goToFAQ = () => {
		navigate("/faq");
	};

	const goToLogin = () => {
		navigate("/login");
	};

	return (
		<main className="flex flex-col items-center justify-center h-screen gap-4 max-w-lg mx-auto px-4 lg:px-0">
			<h1 className="title-h1 text-(--white) font-light">
				Fanta
				<span className="text-(--primary) font-bold">UNIVERSE</span>
			</h1>
			<div className="flex gap-4 w-full">
				<ButtonHome action={goToRules}>
					<img src="/images/rules.svg" alt="" className="w-8" />
					<p className="text-(--white)">Regolamento</p>
				</ButtonHome>
				<ButtonHome action={goToFAQ}>
					<img src="/images/info.svg" alt="" className="w-8" />
					<p className="text-(--white)">Faq</p>
				</ButtonHome>
			</div>
			<h2 className="title-h5 text-(--white) font-medium">
				Fantaverso, rendi ogni tua idea fantastica!
			</h2>
			<ButtonPrimary action={goToLogin}>
				<p className="body-regular font-bold">GIOCA</p>
			</ButtonPrimary>
		</main>
	);
}
