import { useState } from "react";
import faqsData from "../assets/faq.json";
import Navbar from "../components/Navbar";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router";

export default function FAQPage() {
	const navigate = useNavigate();
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<>
			<Navbar />
			<button
				className="flex items-center gap-[10px] justify-center w-full p-[10px] bg-(--black-light) body-normal"
				onClick={() => navigate("/app")}
			>
				<ChevronLeft className="h-[24px] w-[24px]" />
				Torna alla dashboard
			</button>
			<main className="max-w-3xl mx-auto py-8 px-4 lg:py-16 lg:px-6 flex flex-col gap-4 min-h-[calc(100dvh-64px)]">
				<h1 className="title-h4 font-medium text-(--black-normal)">
					Domande frequenti
				</h1>
				<section className="max-w-[840px]">
					<ul className="flex flex-col gap-4">
						{faqsData.faqs.map((faq, index) => (
							<li
								key={index}
								className={`rounded-[12px] p-[8px] transition-all duration-300 ease bg-(--black-light)`}
							>
								<button
									className="w-full flex justify-between items-center gap-[8px] body-normal font-medium text-(--black-normal) text-left bg-white rounded-[4px] p-[10px]"
									onClick={() => toggleFAQ(index)}
									aria-expanded={openIndex === index}
								>
									{faq.question}
									{openIndex === index ? (
										<ChevronUp className="h-[24px] w-[24px]" />
									) : (
										<ChevronDown className="h-[24px] w-[24px]" />
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
				</section>
			</main>
		</>
	);
}
