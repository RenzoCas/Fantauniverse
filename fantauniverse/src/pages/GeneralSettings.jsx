import { useState, useEffect } from "react"; // Importa useEffect per il controllo dei cambiamenti
import { useLeague } from "../contexts/LeagueContext";
import Select from "../atoms/Inputs/Select";
import {
	CheckIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import NormalButton from "../atoms/Buttons/NormalButton";
import GhostButton from "../atoms/Buttons/GhostButton";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";

function GeneralSettings() {
	const { league, getLeague, deleteLeague, updateLeague } = useLeague();
	const { id } = league;
	const [selectedValue, setSelectedValue] = useState(league.status);
	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [newName, setNewName] = useState(league.name);
	const [newDescription, setNewDescription] = useState(league.description);
	const [isLoading, setIsLoading] = useState(false);
	const [updatedLeague, setUpdatedLeague] = useState(league);
	const [isSaveDisabled, setIsSaveDisabled] = useState(true); // Stato per il pulsante salva
	const navigate = useNavigate();

	const options = [
		{
			value: "PENDING",
			text: "Non pubblicata",
		},
		{
			value: "NOT_STARTED",
			text: "Pubblicata",
		},
		{
			value: "STARTED",
			text: "Avviata",
		},
		{
			value: "FINISHED",
			text: "Terminata",
		},
	];

	const currentIndex = options.findIndex(
		(opt) => opt.value === league.status
	);

	const filteredOptions = options.slice(currentIndex, currentIndex + 2);

	const handleChange = (value) => {
		setSelectedValue(value);
	};

	const handleEditName = () => {
		setIsEditingName(true);
	};

	const handleEditDescription = () => {
		setIsEditingDescription(true);
	};

	const confirmEditName = async () => {
		setIsEditingName(false);
		setUpdatedLeague({ ...league, name: newName });
	};

	const confirmEditDescription = async () => {
		setIsEditingDescription(false);
		setUpdatedLeague({ ...league, description: newDescription });
	};

	const handleUpdateLeague = async () => {
		setIsLoading(true);
		await updateLeague(updatedLeague);
		await getLeague(id);
		setIsLoading(false);
	};

	const handleDeleteLeague = async () => {
		setIsLoading(true);
		await deleteLeague(id);
		setIsLoading(false);
		navigate("/app");
	};

	// Funzione per verificare se ci sono modifiche
	useEffect(() => {
		const hasChanges =
			newName !== league.name ||
			newDescription !== league.description ||
			selectedValue !== league.status;
		setIsSaveDisabled(!hasChanges); // Se non ci sono modifiche, disabilita il pulsante
	}, [
		newName,
		newDescription,
		selectedValue,
		league.name,
		league.description,
		league.status,
	]);

	return (
		<>
			{isLoading && <Loader />}
			<div className="flex flex-col items-between gap-[40px]">
				<div className="flex flex-col gap-[16px]">
					<Select
						options={filteredOptions}
						selectedValue={selectedValue}
						handleChange={handleChange}
					/>

					<div className="flex gap-[10px] items-center px-[10px]">
						{isEditingName ? (
							<button
								className="p-[10px] bg-(--black-light) rounded-full max-h-fit"
								onClick={confirmEditName}
							>
								<CheckIcon className="h-[20px] w-[20px]" />
							</button>
						) : (
							<button
								className="p-[10px] bg-(--black-light) rounded-full max-h-fit"
								onClick={handleEditName}
							>
								<PencilSquareIcon className="h-[20px] w-[20px]" />
							</button>
						)}

						{isEditingName ? (
							<input
								type="text"
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								className="body-small font-semibold text-(--black-normal) border border-gray-300 rounded-md p-2"
							/>
						) : (
							<h1 className="title-h4 font-medium">
								{league.name}
							</h1>
						)}
					</div>

					<div className="flex gap-[10px] items-center px-[10px]">
						{isEditingDescription ? (
							<button
								className="p-[10px] bg-(--black-light) rounded-full max-h-fit"
								onClick={confirmEditDescription}
							>
								<CheckIcon className="h-[20px] w-[20px]" />
							</button>
						) : (
							<button
								className="p-[10px] bg-(--black-light) rounded-full max-h-fit"
								onClick={handleEditDescription}
							>
								<PencilSquareIcon className="h-[20px] w-[20px]" />
							</button>
						)}

						{isEditingDescription ? (
							<input
								type="text"
								value={newDescription}
								onChange={(e) =>
									setNewDescription(e.target.value)
								}
								className="body-small font-semibold text-(--black-normal) border border-gray-300 rounded-md p-2"
							/>
						) : (
							<p className="body-normal">{league.description}</p>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-[8px]">
					<NormalButton
						text="Salva"
						action={handleUpdateLeague}
						icon={false}
						disabled={isEditingName || isSaveDisabled}
					/>
					<GhostButton
						text="Elimina lega"
						action={handleDeleteLeague}
						classOpt="text-(--error-normal)"
						customIcon={true}
						disabled={isEditingName || isEditingDescription}
					>
						<TrashIcon className="w-[24px] h-[24px]" />
					</GhostButton>
				</div>
			</div>
		</>
	);
}

export default GeneralSettings;
