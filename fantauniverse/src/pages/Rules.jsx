export default function Regolamento() {
	return (
		<main className="max-w-3xl mx-auto py-8 px-4 lg:py-16 lg:px-6 flex flex-col gap-4 min-h-[calc(100dvh-64px)]">
			<h1 className="title-h5 font-regular text-(--primary) text-center">
				Regolamento
			</h1>
			<section className="p-8 bg-[#1A2D4C]/60 rounded-2xl max-w-[840px]">
				<ul className="flex flex-col">
					<li className="flex flex-col gap-2 py-4 border-b border-b-(--primary)">
						<h4 className="title-h6 text-(--white)">
							Cosa é Fanta
							<span className="text-(--primary) font-bold">
								UNIVERSE
							</span>
							?
						</h4>
						<p className="body-small text-(--white)">
							FantaUNIVERSE è un gioco in cui gli utenti possono
							creare e partecipare a fantasfide su qualsiasi
							argomento! Dai classici come il Fantacalcio e il
							Fantasanremo fino a idee originali come il
							Fantacooking, il Fantafilm o il Fantagossip.
						</p>
					</li>
					<li className="flex flex-col gap-2 py-4 border-b border-b-(--primary)">
						<h4 className="title-h6 text-(--white)">
							Come Funziona?
						</h4>
						<ul className="list-disc ml-8 flex flex-col gap-2">
							<li className="body-small text-(--white)">
								<span className="font-bold mr-1 text-(--primary)">
									Registrazione:
								</span>
								Ogni utente si iscrive alla piattaforma e può
								partecipare a leghe già esistenti o crearne di
								nuove.
							</li>
							<li className="body-small text-(--white)">
								<span className="font-bold mr-1 text-(--primary)">
									Creazione di una lega:
								</span>
								Chiunque può creare una nuova lega scegliendo le
								regole, il sistema di punteggio e
								l&lsquo;argomento.
							</li>
							<li className="body-small text-(--white)">
								<span className="font-bold mr-1 text-(--primary)">
									Partecipazione:
								</span>
								Gli utenti si iscrivono alle leghe, creano
								squadre o formazioni (a seconda del tipo di
								lega) e iniziano a giocare.
							</li>
							<li className="body-small text-(--white)">
								<span className="font-bold mr-1 text-(--primary)">
									Punteggio e Classifica:
								</span>
								Ogni lega ha regole di punteggio personalizzate,
								che determinano la classifica finale.
							</li>
							<li className="body-small text-(--white)">
								<span className="font-bold mr-1 text-(--primary)">
									Vittoria:
								</span>
								Alla fine della competizione, viene decretato il
								vincitore della lega in base al punteggio
								accumulato.
							</li>
						</ul>
					</li>
					<li className="flex flex-col gap-2 py-4 border-b border-b-(--primary)">
						<h4 className="title-h6 text-(--white)">
							Creazione e gestione della lega
						</h4>
						<ul className="list-disc ml-8 flex flex-col gap-2">
							<li className="body-small text-(--white)">
								Il creatore di una lega ne stabilisce regole,
								durata e modalità di punteggio.
							</li>
							<li className="body-small text-(--white)">
								Può decidere se la lega è pubblica (chiunque può
								iscriversi) o privata (accesso su invito).
							</li>
							<li className="body-small text-(--white)">
								I partecipanti devono seguire le regole della
								lega e rispettare gli altri giocatori.
							</li>
						</ul>
					</li>
					<li className="flex flex-col gap-2 pt-4">
						<h4 className="title-h6 text-(--white)">
							Regole di comportamento
						</h4>
						<ul className="list-disc ml-8 flex flex-col gap-2">
							<li className="body-small text-(--white)">
								Giocare in modo corretto e rispettoso.
							</li>
							<li className="body-small text-(--white)">
								Niente spam o manipolazione dei punteggi.
							</li>
							<li className="body-small text-(--white)">
								Rispettare le decisioni degli amministratori
								delle leghe.
							</li>
						</ul>
					</li>
				</ul>
			</section>
		</main>
	);
}
