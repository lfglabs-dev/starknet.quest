import { useAccount, useProvider } from "@starknet-react/core";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { hexToDecimal } from "../utils/feltService";

const transactionsAtom = atomWithStorage<SQNotification[]>(
  "userNotifications",
  []
);
const readStatusAtom = atomWithStorage<boolean>("unreadNotifications", false);

export function useTransactionManager() {
  const { provider } = useProvider();
  const { address } = useAccount();
  const [notifications, setNotifications] = useAtom(transactionsAtom);
  const [unreadNotifications, setUnread] = useAtom(readStatusAtom);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("notifications", notifications);
      notifications.forEach(checkTransactionStatus);
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [notifications]);

  const checkTransactionStatus = async (
    transaction: SQNotification,
    index: number
  ) => {
    if (transaction.status === "pending") {
      const data = await provider.getTransactionReceipt(transaction.hash);
      const updatedTransactions = [...notifications];

      if (data?.status === "REJECTED") {
        updatedTransactions[index].status = "error";
        updatedTransactions[index].txStatus = "REJECTED";
        setUnread(true);
      } else if (
        data?.finality_status !== "NOT_RECEIVED" &&
        data?.finality_status !== "RECEIVED"
      ) {
        updatedTransactions[index].txStatus = data.finality_status;
        updatedTransactions[index].status = "success";
        setUnread(true);
      }

      setNotifications(updatedTransactions);
    }
  };

  const filteredNotifications = address
    ? notifications.filter(
        (notification) => notification.address === hexToDecimal(address)
      )
    : [];

  const addTransaction = (notification: SQNotification) => {
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
