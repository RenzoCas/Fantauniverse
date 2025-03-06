import { PlusIcon } from "@heroicons/react/24/outline";
import GenericInput from "../atoms/Inputs/GenericInput";
import Lega from "../components/League";
import ModalCreateLeague from "../components/modals/ModalCreateLeague";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useLeague } from "../contexts/LeagueContext";

function Dashboard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user } = useUser();
	const { myLeagues, getMyLeagues, createLeague, findLeague } = useLeague();
	const [formData, setFormData] = useState({
		name: "",
	});

	useEffect(() => {
		getMyLeagues();
	}, [getMyLeagues]);

	const handleCreateLeague = async (formData) => {
		const newLeague = await createLeague(formData);
		if (newLeague) {
			getMyLeagues();
		}
		setIsModalOpen(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		findLeague();
	};

	return (
		<div className="flex flex-col gap-[30px]">
			<h1 className="title-h4 text-(--primary)">
				Bentornato, <br /> {user.username}
			</h1>
			<section className="flex flex-col gap-[12px]">
				<div className="flex justify-between items-center gap-[8px]">
					<p className="body-regular font-semibold">Le tue leghe</p>
					{myLeagues.length > 0 && (
						<div className="flex gap-[8px] items-center">
							<p className="body-small whitespace-nowrap">
								Crea lega
							</p>
							<button
								onClick={() => setIsModalOpen(true)}
								className="p-[4px] bg-(--black-light) rounded-full"
							>
								<PlusIcon className="h-[16px] w-[16px]" />
							</button>
						</div>
					)}
				</div>
				<form onSubmit={handleSubmit}>
					<GenericInput
						type="search"
						name="cercaLega"
						id="cercaLega"
						placeholder="Cerca una lega a cui iscriverti"
						value={formData.rule}
						handleChange={handleChange}
					/>
				</form>

				{myLeagues.length !== 0 ? (
					<ul className="flex flex-col gap-[10px]">
						{myLeagues.map((el) => (
							<Lega key={el.id} league={el} />
						))}
					</ul>
				) : (
					<p className="body-normal font-semibold text-(--black-darker) text-center">
						Sembra che tu non abbia ancora una lega. Cerca una nuova
						lega oppure creane una da zero.
					</p>
				)}
			</section>

			{myLeagues.length === 0 && (
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
				onCreate={handleCreateLeague}
			/>
		</div>
	);
}

export default Dashboard;
