import { useState } from "react";
import faqsData from "../assets/faq.json";
import Navbar from "../components/Navbar";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function FAQPage() {
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<>
			<Navbar />
			<main className="max-w-3xl mx-auto py-8 px-4 lg:py-16 lg:px-6 flex flex-col gap-4 min-h-[calc(100dvh-64px)]">
				<h1 className="title-h4 font-medium text-(--black-normal)">
					Consulta le nostre FAQ
				</h1>
				<section className="max-w-[840px]">
					<ul className="flex flex-col gap-4">
						{faqsData.faqs.map((faq, index) => (
							<li
								key={index}
								className={`border border-(--black-light-active) rounded-lg p-[16px] transition-all duration-300 ease-in-out ${
									openIndex === index
										? "bg-(--black-light-active)"
										: "bg-(--black-light)"
								}`}
							>
								<button
									className="w-full flex justify-between items-center gap-[8px] body-normal font-medium text-(--white) text-left transition-colors duration-300"
									onClick={() => toggleFAQ(index)}
									aria-expanded={openIndex === index}
								>
									<span className={`text-(--black-normal)`}>
										{faq.question}
									</span>
									{openIndex === index ? (
										<MinusCircleIcon className="h-6 w-6 min-w-[24px]" />
									) : (
										<PlusCircleIcon className="h-6 w-6 min-w-[24px]" />
									)}
								</button>
								<div
									className={`overflow-hidden transition-all duration-300 ease-in-out ${
										openIndex === index
											? "max-h-[500px] opacity-100"
											: "max-h-0 opacity-0"
									}`}
								>
									<p className="body-small text-(--black-normal) mt-[8px]">
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
