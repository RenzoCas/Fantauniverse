import { PlusIcon } from "@heroicons/react/24/outline";
import GenericInput from "../atoms/Inputs/GenericInput";
import Lega from "../atoms/Lega";
import ModalCreateLeague from "../components/ModalCreateLeague";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user, urlServer } = useAuth();
	const [leagues, setLeagues] = useState([]);

	useEffect(() => {
		const getLeagues = async () => {
			try {
				const response = await fetch(`${urlServer}/league/myLeague`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Errore nel caricamento delle leghe.");
				}
				const data = await response.json();
				setLeagues(data);
			} catch (error) {
				console.error(error.message);
			}
		};

		getLeagues();
	}, [urlServer, user.token]);

	return (
		<div className="flex flex-col gap-[30px]">
			<h1 className="title-h4 text-(--primary)">
				Bentornato, <br /> {user.username}
			</h1>
			<section className="flex flex-col gap-[12px]">
				<div className="flex justify-between items-center gap-[8px]">
					<p className="body-regular font-semibold">Le tue leghe</p>
					<button
						onClick={() => setIsModalOpen(true)}
						className="p-[4px] bg-(--black-light) rounded-full"
					>
						<PlusIcon className="h-[16px] w-[16px]" />
					</button>
				</div>

				<GenericInput
					type="search"
					name="cercaLega"
					id="cercaLega"
					placeholder="Cerca una lega a cui iscriverti"
				/>

				{leagues.length !== 0 ? (
					<ul className="flex flex-col gap-[10px]">
						{leagues.map((el) => (
							<Lega key={el.id} lega={el} />
						))}
					</ul>
				) : (
					<p className="body-normal font-semibold text-(--black-darker) text-center">
						Sembra che non hai ancora una lega, cerca una nuova lega
						o creane una da 0.
					</p>
				)}
			</section>

			{leagues.length === 0 && (
				<button
					onClick={() => setIsModalOpen(true)}
					className="group flex items-center justify-center gap-[24px] rounded-full px-[24px] py-[12px] text-white bg-(--accent-normal)"
				>
					<span>Crea una nuova lega</span>
					<PlusIcon className="h-[24px] w-[24px] text-(--black-normal) bg-white p-[4px] rounded-full" />
				</button>
			)}

			<ModalCreateLeague
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}

export default Dashboard;
