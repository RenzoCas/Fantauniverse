import Logo from "../atoms/Logo";
import NormalButton from "../atoms/Buttons/NormalButton";
import GhostButton from "../atoms/Buttons/GhostButton";
import { useNavigate } from "react-router";

export default function Homepage() {
	const navigate = useNavigate();

	return (
		<main className="md:max-w-sm flex flex-col justify-center gap-[62px] mx-auto py-[40px] min-h-dvh">
			<div className="flex flex-col gap-[8px] px-[32px] md:px-0">
				<Logo></Logo>
				<h2 className="font-bold">
					All.
					<br />
					The league.
					<br />
					That u want.
				</h2>
			</div>
			<div className="flex flex-col gap-[8px]">
				<span className="h-[22px] bg-(--black-normal)"></span>
				<span className="h-[22px] bg-(--black-normal)"></span>
			</div>
			<div className="flex flex-col gap-[8px] px-[32px] md:px-0">
				<NormalButton
					text="Accedi Ora"
					action={() => {
						navigate("/login");
					}}
				/>
				<GhostButton
					text="Non sei registrato? Registrati"
					action={() => {
						navigate("/registrazione");
					}}
				/>
			</div>
			<div className="flex flex-col gap-[16px] px-[32px] md:px-0">
				<p className="body-small text-(--black-normal) text-center">
					Non sai cosa é FantaUniverse?
				</p>
				<GhostButton
					text="Scopri come creare il tuo universo"
					icon={false}
				/>
			</div>
		</main>
	);
}
