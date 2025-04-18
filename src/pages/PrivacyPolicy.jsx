import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import privacyData from "../assets/privacy.json";
import { useNavigate } from "react-router";
import Logo from "../atoms/Logo";

export default function PrivacyPage() {
	const navigate = useNavigate();
	const [openIndex, setOpenIndex] = useState(null);

	const togglePrivacy = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<>
			<button
				className="flex items-center gap-[10px] w-full p-[10px] bg-(--black-light) body-normal lg:hidden fixed top-[64px] left-0 z-1 cursor-pointer"
				onClick={() => navigate("/app")}
			>
				<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
				Torna alla dashboard
			</button>
			<div className="hidden lg:fixed lg:top-[8px] lg:left-[370px] lg:flex lg:w-full lg:px-[20px] lg:py-[20px] lg:border-b-2 lg:border-b-solid lg:border-b-(--black-light-hover) lg:max-w-[calc(100vw-370px)]">
				<Logo />
			</div>
			<section className="pt-8 lg:p-0 flex flex-col gap-4 lg:max-w-[840px] lg:mx-auto">
				<h1 className="title-h4 font-medium text-(--black-normal)">
					Privacy policy
				</h1>
				<div className="max-w-[840px]">
					<ul className="flex flex-col gap-4">
						{privacyData.privacys.map((privacy, index) => (
							<li
								key={index}
								className={`rounded-[12px] p-[8px] transition-all duration-300 ease bg-(--black-light)`}
							>
								<button
									className="w-full flex justify-between items-center gap-[8px] body-normal font-medium text-(--black-normal) text-left bg-white rounded-[4px] p-[10px] cursor-pointer"
									onClick={() => togglePrivacy(index)}
									aria-expanded={openIndex === index}
								>
									{privacy.title}
									{openIndex === index ? (
										<ChevronUp className="h-[24px] w-[24px] flex-shrink-0" />
									) : (
										<ChevronDown className="h-[24px] w-[24px] flex-shrink-0" />
									)}
								</button>
								<div
									className={`overflow-hidden transition-all duration-300 ease-in-out bg-white rounded-[4px] ${
										openIndex === index
											? "max-h-[500px] opacity-100 mt-[8px] p-[10px]"
											: "max-h-0 opacity-0"
									}`}
								>
									<p className="body-normal text-(--black-normal)">
										{privacy.text}
									</p>
									{privacy.lista && (
										<ul className="flex flex-col gap-[8px] mt-[8px] list-disc">
											{privacy.lista.map(
												(item, index) => (
													<li
														key={index}
														className="body-normal text-(--black-normal) flex items-center gap-[8px]"
													>
														<span className="h-[4px] w-[4px] rounded-full bg-(--black-normal)"></span>
														{item}
													</li>
												)
											)}
										</ul>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>
			</section>
		</>
	);
}
