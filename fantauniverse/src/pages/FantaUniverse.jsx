import { PlusIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import GenericInput from "../atoms/Inputs/GenericInput";
import TabButton from "../atoms/Buttons/TabButton";
import Lega from "../atoms/Lega";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import ModalCreateLeague from "../components/ModalCreateLeague";

export default function FantaUniverse() {
	const { user, urlServer } = useAuth();
	const [leagues, setLeague] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [adminLeague, setAdminLeague] = useState(false);

	useEffect(() => {
		const getLeague = async () => {
			try {
				const response = await fetch(
					`${urlServer}/league/myLeague?role=${
						adminLeague == true ? "ADMIN" : "PARTICIPANT"
					}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Errore nel caricamento delle leghe.");
				}
				const data = await response.json();
				setLeague(data);
			} catch (error) {
				console.error(error.message);
			}
		};

		getLeague();
	}, [urlServer, user.token, adminLeague]);

	return (
		<>
			<header>
				<Navbar />
			</header>
			<main className="max-w-xl mx-auto py-[24px] px-[16px] lg:py-16 lg:px-6 flex flex-col gap-[30px] min-h-[calc(100dvh-64px)]">
				<h1 className="title-h4 text-(--primary)">
					Bentornato, <br /> {user.username}
				</h1>
				<section className="flex flex-col gap-[12px]">
					<div className="flex justify-between items-center gap-[8px]">
						<p className="body-regular font-semibold">
							Le tue leghe
						</p>
						{adminLeague && leagues.length !== 0 && (
							<button
								onClick={() => setIsModalOpen(true)}
								className="p-[4px] bg-(--black-light) rounded-full"
							>
								<PlusIcon className="h-[16px] w-[16px]" />
							</button>
						)}
					</div>

					<div className="flex align-center">
						<TabButton
							handleClick={() => setAdminLeague(false)}
							active={!adminLeague}
						>
							Partecipante
						</TabButton>
						<TabButton
							handleClick={() => setAdminLeague(true)}
							active={adminLeague}
						>
							Admin
						</TabButton>
					</div>

					{!adminLeague && (
						<GenericInput
							type="search"
							name="cercaLega"
							id="cercaLega"
							placeholder="Cerca una lega a cui iscriverti"
						/>
					)}

					{leagues.length !== 0 && (
						<ul className="flex flex-col gap-[10px]">
							{leagues.map((el) => (
								<Lega
									key={el.id}
									icon={el.icon}
									name={el.name}
									participants={el.participants?.length}
								/>
							))}
						</ul>
					)}
				</section>
				{adminLeague && leagues.length === 0 && (
					<>
						<p className="body-normal font-semibold text-(--black-darker) text-center">
							Sembra che non hai creato nessuna lega. Creane una
							da 0.
						</p>
						<button
							onClick={() => setIsModalOpen(true)}
							className="group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-white bg-(--accent-normal)"
						>
							<span>Crea una nuova lega</span>
							<PlusIcon className="h-[24px] w-[24px] text-(--black-normal) bg-white p-[4px] rounded-full" />
						</button>
					</>
				)}
				<ModalCreateLeague
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			</main>
		</>
	);
}
