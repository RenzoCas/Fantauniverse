import { useState } from "react";
import faqsData from "../assets/faq.json";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router";
import Logo from "../atoms/Logo";

export default function FAQPage() {
	const navigate = useNavigate();
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<>
			<button
				className="flex items-center gap-[10px] justify-center w-full p-[10px] bg-(--black-light) body-normal lg:hidden fixed top-[64px] left-0 z-1 cursor-pointer"
				onClick={() => navigate("/app")}
			>
				<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
				Torna alla dashboard
			</button>
			<div className="hidden lg:fixed lg:top-[8px] lg:left-[370px] lg:flex lg:w-full lg:px-[20px] lg:py-[20px] lg:border-b-2 lg:border-b-solid lg:border-b-(--black-light-hover) lg:max-w-[calc(100vw-370px)]">
				<Logo />
			</div>
			<section className="pt-8 lg:p-0 flex flex-col gap-4">
				<h1 className="title-h4 font-medium text-(--black-normal)">
					Domande frequenti
				</h1>
				<div className="max-w-[840px]">
					<ul className="flex flex-col gap-4">
						{faqsData.faqs.map((faq, index) => (
							<li
								key={index}
								className={`rounded-[12px] p-[8px] transition-all duration-300 ease bg-(--black-light)`}
							>
								<button
									className="w-full flex justify-between items-center gap-[8px] body-normal font-medium text-(--black-normal) text-left bg-white rounded-[4px] p-[10px] cursor-pointer"
									onClick={() => toggleFAQ(index)}
									aria-expanded={openIndex === index}
								>
									{faq.question}
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
										{faq.answer}
									</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</section>
		</>
	);
}
