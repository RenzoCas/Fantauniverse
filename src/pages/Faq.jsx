import { useState } from "react";
import faqsData from "../assets/faq.json";

export default function FAQPage() {
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<main className="max-w-3xl mx-auto py-8 px-4 lg:py-16 lg:px-6 flex flex-col gap-4 min-h-[calc(100dvh-64px)]">
			<h1 className="title-h5 font-regular text-(--primary) text-center">
				Domande frequenti
			</h1>
			<section className="p-8 bg-[#1A2D4C]/60 rounded-2xl max-w-[840px] flex flex-col gap-4">
				{faqsData.faqs.map((faq, index) => (
					<div
						key={index}
						className={`border-b border-b-(--primary) flex flex-col gap-2 ${
							openIndex === index && "pb-2"
						}`}
					>
						<button
							className="w-full flex justify-between items-center title-h6 text-(--white) text-left"
							onClick={() => toggleFAQ(index)}
						>
							<span>{faq.question}</span>
							{openIndex === index ? (
								<img
									src="/images/minus.svg"
									alt=""
									className="w-8"
								/>
							) : (
								<img
									src="/images/plus.svg"
									alt=""
									className="w-8"
								/>
							)}
						</button>
						<p
							className={`max-h-0 overflow-hidden transition-all duration-300 ease-in-out body-small text-(--white) pl-2 ${
								openIndex === index ? "max-h-[1000px]" : "p-0"
							}`}
						>
							{openIndex === index && faq.answer}
						</p>
					</div>
				))}
			</section>
		</main>
	);
}
