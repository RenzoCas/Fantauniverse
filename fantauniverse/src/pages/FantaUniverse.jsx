import { PlusIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import GenericInput from "../atoms/Inputs/GenericInput";
import Lega from "../atoms/Lega";
// import { useAuth } from "../contexts/AuthContext";

export default function FantaUniverse() {
	// const { user } = useAuth();

	const leghe = [
		{
			id: 1,
			logo: "https://placehold.co/60x60",
			nome: "Cellamaremo",
			numPartecipanti: 2,
		},
		{
			id: 2,
			logo: "https://placehold.co/60x60",
			nome: "Balliamo",
			numPartecipanti: 10,
		},
		{
			id: 3,
			logo: "https://placehold.co/60x60",
			nome: "Pippo",
			numPartecipanti: 5,
		},
	];

	return (
		<>
			<header>
				<Navbar></Navbar>
			</header>
			<main className="max-w-xl mx-auto py-[24px] px-[16px] lg:py-16 lg:px-6 flex flex-col gap-[30px] min-h-[calc(100dvh-64px)]">
				<h1 className="title-h4 text-(--primary)">
					Bentornato, <br /> Renzo
				</h1>
				<section className="flex flex-col gap-[12px]">
					<div className="flex justify-between items-center gap-[8px]">
						<p className="body-regular font-semibold">
							Le tue leghe
						</p>
						{leghe.length != 0 && (
							<button className="p-[4px] bg-(--black-light) rounded-full">
								<PlusIcon className="h-[16px] w-[16px]"></PlusIcon>
							</button>
						)}
					</div>
					<GenericInput
						type="search"
						name="cercaLega"
						id="cercaLega"
						placeholder="Cerca una lega a cui iscriverti"
					></GenericInput>
					{leghe.length != 0 && (
						<ul className="flex flex-col gap-[10px]">
							{leghe.map((el) => (
								<Lega
									key={el.id}
									icona={el.logo}
									nome={el.nome}
									numPartecipanti={el.numPartecipanti}
								/>
							))}
						</ul>
					)}
				</section>
				{leghe.length == 0 && (
					<>
						<p className="body-normal font-semibold text-(--black-darker) text-center">
							Sembra che non hai ancora una lega, cerca una nuova
							lega o creane una da 0.
						</p>
						<button
							className={`group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-white bg-(--accent-normal)`}
						>
							<span>Crea una nuova lega</span>
							<PlusIcon className="h-[24px] w-[24px] text-(--black-normal) bg-white p-[4px] rounded-full"></PlusIcon>
						</button>
					</>
				)}
			</main>
		</>
	);
}
