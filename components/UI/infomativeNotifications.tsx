import React from "react";
import styles from "../../styles/components/informativeNotification.module.css";
import { FunctionComponent } from "react";
import Link from "next/link";

type NotificationDetailProps = {
  notification: SQInfoData;
  closeModal: () => void;
};

const InformativeNotification: FunctionComponent<NotificationDetailProps> = ({
  notification,
  closeModal,
}) => {
  return (
    <div className={styles.notif_detail} onClick={closeModal}>
      <div className={styles.notif_title}>
        <div>{notification.title}</div>
      </div>
      <div className={styles.quest_name}>{notification.subtext}</div>
      <div className={styles.notif_info}>
        <Link href={`${notification.link}`}>
          <div className={styles.notif_link}>{notification.linkText}</div>
        </Link>
      </div>
      <div className={styles.notif_line} />
    </div>
  );
};
export default InformativeNotification;
