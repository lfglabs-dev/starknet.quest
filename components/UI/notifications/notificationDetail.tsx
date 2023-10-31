import React, { useMemo } from "react";
import styles from "../../../styles/components/notifications.module.css";
import { FunctionComponent } from "react";
import DoneIcon from "../iconsComponents/icons/doneIcon";
import theme from "../../../styles/theme";
import CloseCircleIcon from "../iconsComponents/icons/closeCircleIcon";
import { timeElapsed } from "../../../utils/timeService";
import {
  NotificationType,
  TransactionType,
  notificationLinkText,
  notificationTitle,
} from "../../../constants/notifications";
import { CircularProgress } from "@mui/material";

type NotificationDetailProps = {
  notification: SQNotification<NotificationData>;
  isLastItem: boolean;
};

const NotificationDetail: FunctionComponent<NotificationDetailProps> = ({
  notification,
  isLastItem,
}) => {
  const statusIcon = useMemo(() => {
    if (notification.type === NotificationType.TRANSACTION) {
      if (notification.data.status === "pending") {
        return <CircularProgress color="secondary" size={24} />;
      } else if (notification.data.status === "error") {
        return <CloseCircleIcon width="24" color="" />;
      } else {
        return <DoneIcon width="24" color={theme.palette.primary.main} />;
      }
    }
  }, [notification, notification.data?.status]);

  const externalUrl = useMemo(() => {
    if (notification.type === NotificationType.TRANSACTION) {
      return `https://${
        process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet." : ""
      }starkscan.co/tx/${notification.data.hash}`;
    }
  }, [notification]);

  const title = useMemo(() => {
    if (notification.type === NotificationType.TRANSACTION) {
      return notificationTitle[notification.data.type as TransactionType][
        notification.data.status
      ];
    }
  }, [notification, notification.data?.status]);

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
