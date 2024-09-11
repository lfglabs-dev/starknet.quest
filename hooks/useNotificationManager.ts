import { useAccount, useProvider } from "@starknet-react/core";
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
  const { provider } = useProvider();
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadNotifications, setUnread] = useAtom(readStatusAtom);

  const updateNotificationStatus = (
    txHash: string,
    status: "error" | "pending" | "success"
  ) => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.data.hash === txHash) {
        return {
          ...notification,
          data: {
            ...notification.data,
            status,
          },
        };
      }
      return notification;
    });
  
    setNotifications(updatedNotifications);
  };

  const checkTransactionStatus = async (txHash: string) => {
    const data = await provider.getTransactionReceipt(txHash);
    if (data?.status === "REJECTED" || data?.status === "REVERTED") {
      updateNotificationStatus(txHash, "error");
      setUnread(true);
    } else if (
      data?.status === "ACCEPTED_ON_L2" ||
      data?.status === "ACCEPTED_ON_L1" ||
      data?.finality_status === "ACCEPTED_ON_L2" ||
      data?.finality_status === "ACCEPTED_ON_L1"
    ) {
      updateNotificationStatus(txHash, "success");
      setUnread(true);
    }
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
    checkTransactionStatus,
  };
}
