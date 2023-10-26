import { useAccount, useProvider } from "@starknet-react/core";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { hexToDecimal } from "../utils/feltService";
import { NotificationType } from "../constants/notifications";

const notificationsAtom = atomWithStorage<SQNotification<NotificationData>[]>(
  "userNotifications_SQ",
  []
);
const readStatusAtom = atomWithStorage<boolean>(
  "unreadNotifications_SQ",
  false
);

export function useNotificationManager() {
  const { provider } = useProvider();
  const { address } = useAccount();
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadNotifications, setUnread] = useAtom(readStatusAtom);

  useEffect(() => {
    const intervalId = setInterval(() => {
      notifications.forEach(checkTransactionStatus);
      console.log("notifications", notifications);
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [notifications]);

  const checkTransactionStatus = async (
    notification: SQNotification<NotificationData>,
    index: number
  ) => {
    if (notification.type !== NotificationType.TRANSACTION) return;
    if (notification.address !== hexToDecimal(address)) return;
    if (notification.data.status === "pending") {
      const transaction = notification.data;
      const data = await provider.getTransactionReceipt(transaction.hash);
      const updatedTransactions = [...notifications];

      if (data?.status === "REJECTED" || data?.status === "REVERTED") {
        updatedTransactions[index].data.status = "error";
        updatedTransactions[index].data.txStatus = "REJECTED";
        setNotifications(updatedTransactions);
        setUnread(true);
      } else if (
        data?.finality_status !== "NOT_RECEIVED" &&
        data?.finality_status !== "RECEIVED"
      ) {
        updatedTransactions[index].data.txStatus = data.finality_status;
        updatedTransactions[index].data.status = "success";
        setNotifications(updatedTransactions);
        setUnread(true);
      }
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
  };
}
