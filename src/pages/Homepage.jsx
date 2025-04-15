import { useNavigate } from "react-router";
import Logo from "../atoms/Logo";
import NormalButton from "../atoms/Buttons/NormalButton";
import GhostButton from "../atoms/Buttons/GhostButton";
import { ArrowRight } from "lucide-react";

export default function Homepage() {
	const navigate = useNavigate();

	return (
		<main className="md:max-w-sm flex flex-col justify-center gap-[62px] mx-auto py-[40px] min-h-dvh">
			<div className="flex flex-col gap-[8px] px-[32px] md:px-0">
				<Logo />
				<h1 className="title-h2 font-bold">
					All.
					<br />
					The league.
					<br />
					That u want.
				</h1>
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
					icon={false}
				/>
				<GhostButton
					text="Non sei registrato? Registrati"
					action={() => {
						navigate("/registration");
					}}
					icon={false}
				/>
			</div>
			<div className="flex flex-col gap-[16px] px-[32px] md:px-0">
				<p className="body-small text-(--black-normal) text-center">
					Non sai cosa é FantaUniverse?
				</p>
				<GhostButton
					text="Scopri come creare il tuo universo"
					action={() => {
						navigate("/rules");
					}}
					customIcon={true}
					classOpt={`border border-(--black-light)`}
				>
					<ArrowRight className="h-[24px] w-[24px] stroke-(--black-normal) stroke-1" />
				</GhostButton>
			</div>
		</main>
	);
}
