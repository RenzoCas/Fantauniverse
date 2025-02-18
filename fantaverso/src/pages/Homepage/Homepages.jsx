import { useNavigate } from "react-router";
import ButtonHome from "../../atoms/Buttons/ButtonHome";
import ButtonPrimary from "../../atoms/Buttons/ButtonPrimary";

export default function Homepage() {
	const navigate = useNavigate();
	const goToRules = () => {
		navigate("/regolamento");
	};

	const goToLogin = () => {
		navigate("/login");
	};

	return (
		<main className="flex flex-col items-center justify-center h-screen gap-4 max-w-3xl mx-auto">
			<h1 className="title-h1 cl-white font-light">
				Fanta<span className="cl-primary font-bold">UNIVERSE</span>
			</h1>
			<div className="flex gap-4 w-full">
				<ButtonHome action={goToRules}>
					<img
						src="/images/rules.svg"
						alt=""
						className="w-8 fill-(#fff) stroke-(#fff)"
					/>
					<p className="cl-white">Regolamento</p>
				</ButtonHome>
				<ButtonHome action={goToRules}>
					<img src="/images/info.svg" alt="" className="w-8" />
					<p className="cl-white">Faq</p>
				</ButtonHome>
				<ButtonHome action={goToRules}>
					<img src="/images/quotazioni.svg" alt="" className="w-8" />
					<p className="cl-white">Baudi</p>
				</ButtonHome>
			</div>
			<h2 className="title-h5 cl-white font-medium">
				Fantaverso, rendi ogni tua idea fantastica!
			</h2>
			<ButtonPrimary action={goToLogin}>
				<p>Accedi</p>
			</ButtonPrimary>
		</main>
	);
}
