import { useAccount } from "@starknet-react/core";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { hexToDecimal } from "@utils/feltService";

const notificationsAtom = atomWithStorage<SQNotification<NotificationData>[]>(
  "userNotifications_SQ",
  []
);
const readStatusAtom = atomWithStorage<boolean>(
  "unreadNotifications_SQ",
  false
);

export function useNotificationManager() {
  const { address } = useAccount();
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadNotifications, setUnread] = useAtom(readStatusAtom);

  const updateNotificationStatus = (
    txHash: string,
    status: "error" | "pending" | "success"
  ) => {
    const index = notifications.findIndex(
      (notification) => notification.data.hash === txHash
    );
    notifications[index].data.status = status;
    setNotifications(notifications);
  };

  const filteredNotifications = address
    ? notifications.filter(
        (notification) => notification.address === hexToDecimal(address)
      )
    : [];

  const addTransaction = (notification: SQNotification<NotificationData>) => {
    setNotifications((prev) => [
      { ...notification, address: hexToDecimal(address) },
      ...prev,
    ]);
    setUnread(true);
  };

  const updateReadStatus = () => {
    if (unreadNotifications) {
      setUnread(false);
    }
  };

  return {
    notifications: filteredNotifications,
    addTransaction,
    unreadNotifications,
    updateReadStatus,
    updateNotificationStatus,
  };
}
