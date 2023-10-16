import React, { FunctionComponent, ReactNode } from "react";
import styles from "../../../styles/components/popup.module.css";
import CloseIcon from "../iconsComponents/icons/closeIcon";
import { Modal } from "@mui/material";

type PopupProps = {
  children: ReactNode;
  bottomContent?: ReactNode;
  onClose?: () => void;
};

const Popup: FunctionComponent<PopupProps> = ({
  children,
  bottomContent = null,
  onClose,
}) => {
  return (
    <Modal
      disableAutoFocus
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={true}
    >
      <div className={styles.popup}>
        <div className={styles.popupContent}>{children}</div>
        {bottomContent && (
          <div className={styles.bottomContent}>{bottomContent}</div>
        )}
        {onClose && (
          <button onClick={onClose} className={styles.close}>
            <CloseIcon width="16" />
          </button>
        )}
      </div>
    </Modal>
  );
};

export default Popup;
