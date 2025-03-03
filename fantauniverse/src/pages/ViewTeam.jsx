import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

function ViewTeam() {
	const { state } = useLocation();
	const { urlServer, user } = useAuth();
	const participantId = state.participantId;
	const [team, setTeam] = useState();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getTeam = async () => {
			try {
				setIsLoading(true);
				const result = await fetch(
					`${urlServer}/league/userTeam/${participantId}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					}
				);

				if (!result.ok) {
					throw new Error(
						"Errore nel caricamento dei dati della squadra"
					);
				}

				const data = await result.json();
				setTeam(data);
			} catch (error) {
				console.error(error.message);
			} finally {
				setIsLoading(false);
			}
		};

		getTeam();
	}, [urlServer, participantId, user.token]);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : team.name == null ? (
				<p>Nessun team creato</p>
			) : (
				<div>
					<h4>{team.name}</h4>
					<p>{team.position}</p>
					<ul>
						{team.players.map((el) => (
							<li key={el.id}>
								{el.name} {el.points}
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
}

export default ViewTeam;
