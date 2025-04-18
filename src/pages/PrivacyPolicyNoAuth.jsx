import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import privacyData from "../assets/privacy.json";
import { useNavigate } from "react-router";
import Logo from "../atoms/Logo";

export default function PrivacyPageNoAuth() {
	const navigate = useNavigate();
	const [openIndex, setOpenIndex] = useState(null);

	const togglePrivacy = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<>
			<header className="relative h-[46px] border-b-[2px] border-b-black">
				<div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]">
					<Logo />
				</div>
			</header>
			<button
				className="flex lg:hidden items-center gap-[10px] w-full p-[10px] bg-(--black-light) body-normal cursor-pointer"
				onClick={() => navigate("/registration")}
			>
				<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
				Registrati
			</button>
			<main className="flex lg:grid lg:grid-cols-2 py-[40px] px-[16px] lg:min-h-[calc(100dvh-46px)]">
				<section className="flex flex-col gap-[16px] mx-auto">
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

				<section className="relative hidden lg:block max-w-[708px] max-h-[calc(100dvh-136px)] bg-[url('/images/bgHome.jpg')] bg-centre bg-no-repeat bg-cover rounded-[24px] sticky top-[62px]">
					<div className="flex flex-col gap-[8px] px-[32px] md:px-0 absolute bottom-[30px] left-[30px]">
						<div
							className={`relative rounded-full h-[46px] w-[46px] bg-white`}
						>
							<span
								className={`absolute rounded-full h-[8px] w-[8px] top-1/2 transform -translate-y-1/2 right-[4px] bg-(--black-normal)`}
							></span>
						</div>
						<h1 className="title-h2 font-bold text-white">
							All.
							<br />
							The league.
							<br />
							That u want.
						</h1>
					</div>
				</section>
			</main>
		</>
	);
}
