import React from "react";
import styles from "../../../styles/components/notifications.module.css";
import { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import NotificationDetail from "./notificationDetail";
import CloseIcon from "../iconsComponents/icons/closeIcon";

type ModalNotificationsProps = {
  closeModal: () => void;
  open: boolean;
  notifications: SQNotification<NotificationData>[];
};

const ModalNotifications: FunctionComponent<ModalNotificationsProps> = ({
  closeModal,
  open,
  notifications,
}) => {
  return (
    <Modal
      disableAutoFocus
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.menu}>
        <button className={styles.menu_close} onClick={closeModal}>
          <CloseIcon width="24" />
        </button>
        <p className={styles.menu_title}>Notifications</p>
        <div className={styles.menu_line} />
        <div className={styles.notif_section}>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              return (
                <NotificationDetail
                  key={index}
                  notification={notification}
                  isLastItem={index === notifications.length - 1}
                />
              );
            })
          ) : (
            <p>You don&apos;t have any notifications yet. Start some quests!</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
export default ModalNotifications;
