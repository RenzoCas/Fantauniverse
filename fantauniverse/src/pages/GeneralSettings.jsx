import { useState } from "react";
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
import GenericInput from "../atoms/Inputs/GenericInput";

function GeneralSettings() {
	const { league, getLeague, deleteLeague, updateLeague } = useLeague();
	const { id, name, description, coinName, maxCoins, status } = league;
	const [selectedValue, setSelectedValue] = useState(status);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [isEditing, setIsEditing] = useState({
		name: false,
		description: false,
		coinName: false,
		maxCoins: false,
	});
	const [formData, setFormData] = useState({
		name: name || "",
		description: description || "",
		coinName: coinName || "",
		maxCoins: maxCoins || 0,
	});
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
	const isEditingAnyField = Object.values(isEditing).some(
		(isEditing) => isEditing
	);

	const handleChangeSelect = (value) => {
		setSelectedValue(value);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "maxCoins") {
			if (!/^\d*$/.test(value)) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Inserisci un valore numerico",
				}));
				return;
			}

			const numericValue = Number(value);

			if (numericValue > 10000) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "Il valore massimo è 10.000",
				}));
				return;
			} else {
				setErrors((prevErrors) => ({
					...prevErrors,
					[name]: "",
				}));
			}

			setFormData({
				...formData,
				[name]: numericValue,
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: value.trim() ? "" : "Campo obbligatorio",
		}));
	};

	const toggleEditing = (field) => {
		if (isEditing[field] && errors[field]) return;

		setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const handleUpdateLeague = async () => {
		if (!isFormValid()) return;
		setIsLoading(true);
		await updateLeague({ ...league, ...formData, status: selectedValue });
		await getLeague(id);
		setIsLoading(false);
	};

	const handleDeleteLeague = async () => {
		setIsLoading(true);
		await deleteLeague(id);
		setIsLoading(false);
		navigate("/app");
	};

	const isFormValid = () => {
		return (
			!Object.values(errors).some((error) => error !== "") &&
			((formData.name.trim() !== "" && formData.name.trim() !== name) ||
				(formData.coinName.trim() !== "" &&
					formData.coinName.trim() !== coinName) ||
				(formData.maxCoins > 0 && formData.maxCoins !== maxCoins) ||
				selectedValue !== status)
		);
	};

	return (
		<>
			{isLoading && <Loader />}
			<div className="flex flex-col items-between gap-[40px]">
				<div className="flex flex-col gap-[16px]">
					<Select
						options={filteredOptions}
						selectedValue={selectedValue}
						handleChange={handleChangeSelect}
					/>

					{["name", "description", "coinName", "maxCoins"].map(
						(field) => (
							<div
								key={field}
								className="flex gap-[10px] items-center px-[10px]"
							>
								<button
									className="p-[10px] bg-(--black-light) rounded-full max-h-fit"
									onClick={() => toggleEditing(field)}
								>
									{isEditing[field] ? (
										<CheckIcon className="h-[20px] w-[20px]" />
									) : (
										<PencilSquareIcon className="h-[20px] w-[20px]" />
									)}
								</button>
								{isEditing[field] ? (
									<GenericInput
										type={
											field === "description"
												? "textarea"
												: "text"
										}
										required={true}
										placeholder={`Inserisci ${field}`}
										name={field}
										value={formData[field]}
										handleChange={handleChange}
										handleBlur={handleBlur}
										messageError={errors[field]}
									/>
								) : (
									<p className="body-normal">
										{formData[field]}
									</p>
								)}
							</div>
						)
					)}
				</div>
				<div className="flex flex-col gap-[8px] sticky bottom-[16px] w-full">
					<NormalButton
						text="Salva"
						action={handleUpdateLeague}
						disabled={!isFormValid() || isEditingAnyField}
					/>
					<GhostButton
						text="Elimina lega"
						action={handleDeleteLeague}
						classOpt="text-(--error-normal)"
						disabled={isEditingAnyField}
					>
						<TrashIcon className="w-[24px] h-[24px]" />
					</GhostButton>
				</div>
			</div>
		</>
	);
}

export default GeneralSettings;
