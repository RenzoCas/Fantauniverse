import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext";

const NotificationContext = createContext();

function NotificationProvider({ children }) {
	const { user, urlServer } = useUser();
	const [notifications, setNotifications] = useState([]);

	const getNotifications = async () => {
		try {
			const response = await fetch(
				`${urlServer}/notifications/channel/WEB`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Errore nel recupero delle notifiche.");
			}

			const data = await response.json();
			setNotifications(data);
			return data;
		} catch (error) {
			console.error(
				"Errore nel recupero delle notifiche:",
				error.message
			);
			return [];
		}
	};

	const readNotification = async (notificationId) => {
		try {
			const response = await fetch(
				`${urlServer}/notifications/read/${notificationId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Errore nel segnare la notifica come letta.");
			}

			setNotifications((prev) =>
				prev.map((n) =>
					n.id === notificationId
						? {
								...n,
								read: true,
								readDate: new Date().toISOString(),
						  }
						: n
				)
			);
		} catch (error) {
			console.error(error.message);
		}
	};

	const readAllNotifications = async () => {
		try {
			const response = await fetch(`${urlServer}/notifications/readAll`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nel segnare le notifiche come lette.");
			}

			setNotifications((prev) =>
				prev.map((n) => ({
					...n,
					read: true,
					readDate: new Date().toISOString(),
				}))
			);
		} catch (error) {
			console.error(error.message);
		}
	};

	const deleteNotification = async (notificationId) => {
		try {
			const response = await fetch(
				`${urlServer}/notifications/${notificationId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Errore nella cancellazione della notifica.");
			}

			setNotifications((prev) =>
				prev.filter((n) => n.id !== notificationId)
			);
		} catch (error) {
			console.error(error.message);
		}
	};

	const deleteAllNotifications = async () => {
		try {
			const response = await fetch(`${urlServer}/notifications`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Errore nella cancellazione delle notifiche.");
			}

			setNotifications([]);
		} catch (error) {
			console.error(error.message);
		}
	};

	const unreadCountNotifications = notifications.filter(
		(n) => !n.read
	).length;

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				getNotifications,
				readNotification,
				readAllNotifications,
				deleteNotification,
				deleteAllNotifications,
				unreadCountNotifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
}

function useNotification() {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotification must be used within a NotificationProvider"
		);
	}
	return context;
}

export { NotificationProvider, useNotification };
