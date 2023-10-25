import React, { useMemo } from "react";
import styles from "../../../styles/components/notifications.module.css";
import { FunctionComponent } from "react";
import DoneIcon from "../iconsComponents/icons/doneIcon";
import theme from "../../../styles/theme";
import LoaderIcon from "../iconsComponents/icons/loaderIcon";
import CloseCircleIcon from "../iconsComponents/icons/closeCircleIcon";
import { timeElapsed } from "../../../utils/timeService";

type NotificationDetailProps = {
  notification: SQNotification;
  isLastItem: boolean;
};

const NotificationDetail: FunctionComponent<NotificationDetailProps> = ({
  notification,
  isLastItem,
}) => {
  const statusIcon = useMemo(() => {
    if (notification.status === "pending") {
      return <LoaderIcon width="24" color={theme.palette.secondary.dark} />;
    } else if (notification.status === "error") {
      return <CloseCircleIcon width="24" color="" />;
    } else {
      return <DoneIcon width="24" color={theme.palette.primary.main} />;
    }
  }, [notification.status]);

  const starkscanUrl = useMemo(() => {
    return `https://${
      process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet." : ""
    }starkscan.co/tx/${notification.hash}`;
  }, [notification.hash]);

  return (
    <div className={styles.notif_detail}>
      <div className={styles.notif_title}>
        {statusIcon}
        <div>{notification.title}</div>
      </div>
      <div className={styles.quest_name}>{notification.questName}</div>
      <div className={styles.notif_info}>
        <div className={styles.notif_time}>
          {timeElapsed(notification.timestamp)}
        </div>
        <div
          className={styles.notif_link}
          onClick={() => window.open(starkscanUrl)}
        >
          See transaction
        </div>
      </div>
      {!isLastItem ? <div className={styles.notif_line}></div> : null}
    </div>
  );
};
export default NotificationDetail;
