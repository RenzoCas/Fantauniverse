import { PlusIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
// import { useAuth } from "../contexts/AuthContext";

export default function FantaUniverse() {
	// const { user } = useAuth();

	return (
		<>
			<header>
				<Navbar></Navbar>
			</header>
			<main className="max-w-3xl mx-auto py-[24px] px-[16px] lg:py-16 lg:px-6 flex flex-col gap-[30px] min-h-[calc(100dvh-48px)]">
				<h1 className="title-h4 text-(--primary)">
					Bentornato, <br /> Renzo
				</h1>
				<section>
					<div className="flex justify-between items-center gap-[8px]">
						<p className="body-regular font-semibold">
							Le tue leghe
						</p>
						<button className="p-[4px] bg-(--black-light) rounded-full">
							<PlusIcon className="h-[24px] w-[24px]"></PlusIcon>
						</button>
					</div>
				</section>
			</main>
		</>
	);
}
