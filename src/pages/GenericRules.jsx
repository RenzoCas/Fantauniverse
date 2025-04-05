import { useNavigate } from "react-router";
// import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import Logo from "../atoms/Logo";
import { Book, ChevronLeft } from "lucide-react";

export default function GenericRules() {
	const navigate = useNavigate();
	const { user } = useUser();
	return (
		<>
			{user.id != "" ? (
				<>
					{/* <Navbar /> */}
					<button
						className="flex items-center gap-[10px] justify-center w-full p-[10px] bg-(--black-light) body-normal lg:hidden fixed top-[64px] left-0 z-[100]"
						onClick={() => navigate("/app")}
					>
						<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
						Torna alla dashboard
					</button>
					<div className="hidden lg:fixed lg:top-[8px] lg:left-[370px] lg:flex lg:w-full lg:px-[20px] lg:py-[20px] lg:border-b-2 lg:border-b-solid lg:border-b-(--black-light-hover) lg:max-w-[calc(100vw-370px)]">
						<Logo />
					</div>
				</>
			) : (
				<>
					<header className="relative h-[46px] border-b-[2px] border-b-black">
						<div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]">
							<Logo />
						</div>
					</header>
					<button
						className="flex items-center gap-[10px] justify-center w-full p-[10px] bg-(--black-light) body-normal"
						onClick={() => navigate("/registration")}
					>
						<ChevronLeft className="h-[24px] w-[24px] flex-shrink-0" />
						Vai alla registrazione
					</button>
				</>
			)}

			<section className="max-w-3xl mx-auto py-8 px-4 lg:py-0 lg:px-0 flex flex-col gap-4">
				<h1 className="title-h4 font-medium text-(--black-normal)">
					Regolamento
				</h1>
				<div className="max-w-[840px]">
					<ul className="flex flex-col gap-[12px]">
						<li className="flex flex-col gap-[8px]">
							<h4 className="body-regular text-[#B0B0B0]">
								Cosa &egrave; FantaUniverse?
							</h4>
							<p className="body-normal text-(--black-normal)">
								FantaUniverse &egrave; una piattaforma
								innovativa che permette agli utenti di creare e
								partecipare a fantasfide su qualsiasi argomento!
								<br />
								Dai classici come il Fantasanremo fino a
								proposte originali come il Fantacooking, il
								Fantafilm o il Fantagossip, puoi dare vita a
								sfide uniche e creative.
								<br /> <br />
								FantaUniverse &egrave; un luogo dove la
								competizione si unisce al divertimento e alla
								creativit&agrave;. Partecipa alle leghe, crea la
								tua squadra e sfida i tuoi amici su temi sempre
								nuovi e originali!
							</p>
						</li>
						<li className="flex flex-col gap-[8px]">
							<h4 className="body-regular text-[#B0B0B0]">
								Come Funziona?
							</h4>
							<ul className="list-disc flex flex-col gap-[8px]">
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Registrazione:
										</p>
										<span className="body-small text-(--black-normal)">
											Ogni utente si iscrive alla
											piattaforma e pu&ograve; scegliere
											se unirsi a leghe gi&agrave;
											esistenti o crearne di nuove.
										</span>
									</div>
								</li>
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Creazione di una lega:
										</p>
										<span className="body-small text-(--black-normal)">
											Chiunque pu&ograve; creare una nuova
											lega scegliendo il tema, le regole,
											i player e i valori.
										</span>
									</div>
								</li>
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Partecipazione:
										</p>
										<span className="body-small text-(--black-normal)">
											Una volta iscritti a una lega, gli
											utenti possono formare la propria
											squadra. Quando la lega &egrave;
											avviata, la competizione prende il
											via!
										</span>
									</div>
								</li>
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Punteggio e Classifica:
										</p>
										<span className="body-small text-(--black-normal)">
											Ogni lega ha bonus e malus
											personalizzati che determinano la
											classifica finale.
										</span>
									</div>
								</li>
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Vittoria:
										</p>
										<span className="body-small text-(--black-normal)">
											Alla fine della competizione, il
											vincitore viene proclamato in base
											al punteggio accumulato.
										</span>
									</div>
								</li>
							</ul>
						</li>
						<li className="flex flex-col gap-[8px]">
							<h4 className="body-regular text-[#B0B0B0]">
								Creazione e gestione della lega
							</h4>
							<p className="body-normal text-(--black-normal)">
								Ogni lega si sviluppa in 4 fasi:
							</p>
							<ul className="list-disc flex flex-col gap-[8px]">
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Creazione:
										</p>
										<span className="body-small text-(--black-normal)">
											L&lsquo;utente che crea la lega
											decide il nome, se sar&agrave;
											pubblica (accessibile a tutti) o
											privata (con codice), i bonus, i
											malus, i player disponibili e
											definire il budget per creare la
											squadra.
											<br />
											Inoltre, può stabilire se &egrave;
											possibile scegliere un capitano che
											raddoppier&agrave; i punti di ogni
											giornata.
											<br />
											Dopo aver configurato tutto, la lega
											pu&ograve; essere pubblicata.
										</span>
									</div>
								</li>
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Pubblicazione:
										</p>
										<span className="body-small text-(--black-normal)">
											Durante questa fase, la lega diventa
											visibile a tutti gli utenti della
											piattaforma, che possono iscriversi
											e creare la propria squadra.
										</span>
									</div>
								</li>
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Avvio:
										</p>
										<span className="body-small text-(--black-normal)">
											Una volta avviata, la lega entra nel
											vivo: non sar&agrave; pi&ugrave;
											possibile iscriversi o modificare le
											squadre. <br />
											L&lsquo;admin crea le giornate e
											assegna bonus e malus ai player.
										</span>
									</div>
								</li>
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Conclusione:
										</p>
										<span className="body-small text-(--black-normal)">
											Al termine della competizione, viene
											ufficialmente decretato il
											vincitore. Complimenti!
										</span>
									</div>
								</li>
							</ul>
						</li>
						<li className="flex flex-col gap-[8px]">
							<h4 className="body-regular text-[#B0B0B0]">
								Regole di comportamento
							</h4>
							<ul className="list-disc flex flex-col gap-[8px]">
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Giocare in modo corretto e
											rispettoso.
										</p>
										<span className="body-small text-(--black-normal)">
											Rispetta gli altri utenti e mantieni
											un comportamento sportivo.
										</span>
									</div>
								</li>
								<li className="flex gap-[8px]">
									<Book className="h-[16px] w-[16px] flex-shrink-0" />
									<div className="flex flex-col gap-[6px]">
										<p className="body-normal font-medium text-(--black-normal)">
											Rispettare le decisioni degli
											amministratori delle leghe.
										</p>
										<span className="body-small text-(--black-normal)">
											Gli admin gestiscono la competizione
											in base alle regole stabilite.
										</span>
									</div>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</section>
		</>
	);
}
