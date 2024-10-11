import React, { useEffect, useMemo } from "react";
import styles from "../../../styles/components/notifications.module.css";
import { FunctionComponent } from "react";
import DoneIcon from "@components/UI/iconsComponents/icons/doneIcon";
import theme from "@styles/theme";
import CloseCircleIcon from "@components/UI/iconsComponents/icons/closeCircleIcon";
import { timeElapsed } from "@utils/timeService";
import {
  NotificationType,
  TransactionType,
  notificationLinkText,
  notificationTitle,
} from "@constants/notifications";
import { CircularProgress } from "@mui/material";
import { getCurrentNetwork } from "@utils/network";
import { useWaitForTransaction } from "@starknet-react/core";
import { useNotificationManager } from "@hooks/useNotificationManager";

type NotificationDetailProps = {
  notification: SQNotification<NotificationData>;
  isLastItem: boolean;
};

const NotificationDetail: FunctionComponent<NotificationDetailProps> = ({
  notification,
  isLastItem,
}) => {
  const currentNetwork = getCurrentNetwork();
  const { updateNotificationStatus } = useNotificationManager();
  const { data, error, isLoading, isError } = useWaitForTransaction({
    hash:
      notification.type === NotificationType.TRANSACTION
        ? notification.data.hash
        : "",
    watch: true,
    retry: true,
  });

  const statusIcon = useMemo(() => {
    if (notification.type === NotificationType.TRANSACTION) {
      if (isLoading) {
        return <CircularProgress color="secondary" size={24} />;
      } else if (isError || data?.isRejected()) {
        return <CloseCircleIcon width="24" color="" />;
      } else {
        return <DoneIcon width="24" color={theme.palette.primary.main} />;
      }
    }
  }, [notification, isLoading, error, isError, data]);

  const externalUrl = useMemo(() => {
    if (notification.type === NotificationType.TRANSACTION) {
      return `https://${
        currentNetwork === "TESTNET" ? "testnet." : ""
      }starkscan.co/tx/${notification.data.hash}`;
    }
  }, [notification]);

  const status = useMemo(() => {
    return isLoading
      ? "pending"
      : isError
      ? "error"
      : data?.isRejected()
      ? "error"
      : "success";
  }, [notification, isLoading, error, isError, data]);

  const title = useMemo(() => {
    if (notification.type === NotificationType.TRANSACTION) {
      return notificationTitle[notification.data.type as TransactionType][
        status
      ];
    }
  }, [notification, isLoading, error, isError, data]);

  useEffect(() => {
    if (!status) return;
    if (status !== notification.data.status) {
      updateNotificationStatus(notification.data.hash, status);
    }
  }, [isLoading, error, isError, data, status]);

  return (
    <div className={styles.notif_detail}>
      <div className={styles.notif_title}>
        {statusIcon}
        <div>{title}</div>
      </div>
      <div className={styles.quest_name}>{notification.subtext}</div>
      <div className={styles.notif_info}>
        <div className={styles.notif_time}>
          {timeElapsed(notification.timestamp)}
        </div>
        <div
          className={styles.notif_link}
          onClick={() => window.open(externalUrl)}
        >
          {notificationLinkText[notification.type as NotificationType]}
        </div>
      </div>
      {!isLastItem ? <div className={styles.notif_line} /> : null}
    </div>
  );
};
export default NotificationDetail;
