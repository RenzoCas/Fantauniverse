import { useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { BellOff } from "lucide-react";
import { useNavigate } from "react-router";

function NotificationComponent({ onClose }) {
	const {
		notifications,
		getNotifications,
		readNotification,
		readAllNotifications,
	} = useNotification();
	const navigate = useNavigate();

	useEffect(() => {
		getNotifications();
	}, []);

	const handleClick = (notification) => {
		if (!notification.read) {
			readNotification(notification.id);
		}
		onClose();
		const parsedPayload = JSON.parse(notification.actionPayload);
		navigate(`/app/${parsedPayload.url}`);
	};

	const readAll = () => {
		readAllNotifications();
	};

	return (
		<>
			{notifications.length > 0 && (
				<div className="flex flex gap-[8px] justify-between">
					<button className="body-small" onClick={readAll}>
						Segna come lette
					</button>
					<button className="body-small text-(--error-normal)">
						Cancella tutte
					</button>
				</div>
			)}
			<div className="flex flex-col gap-[10px] flex-1 overflow-y-auto">
				{notifications.length === 0 ? (
					<div className="flex flex-col gap-[10px] flex-1 justify-center items-center">
						<span className="p-[8px] bg-(--black-light) rounded-full flex items-center justify-center">
							<BellOff className="h-[24px] w-[24px]" />
						</span>
						<p className="body-normal font-medium">
							Nessuna notifica
						</p>
						<p className="body-small">
							Si prega di controllare pi&ugrave; tardi
						</p>
					</div>
				) : (
					<>
						{notifications.map((noti) => (
							<div
								key={noti.id}
								onClick={() => handleClick(noti)}
								tabIndex={0}
								className={`cursor-pointer py-[10px] flex flex-col gap-[10px] border-b border-b-(--black-light)`}
							>
								<div className="flex items-center gap-[10px]">
									<p className="body-normal font-medium text-left">
										{noti.title}
									</p>
									{!noti.read && (
										<span className="w-[8px] h-[8px] bg-(--error-normal) rounded-full"></span>
									)}
								</div>
								<p className="body-small text-left">
									{noti.description}
								</p>
								<button className="body-small text-right text-(--error-normal) w-fit self-end">
									Cancella
								</button>
							</div>
						))}
					</>
				)}
			</div>
		</>
	);
}

export default NotificationComponent;
