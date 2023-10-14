import React, { FunctionComponent, ReactNode } from "react";
import styles from "../../../styles/components/popup.module.css";
import CloseIcon from "../iconsComponents/icons/closeIcon";

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
    <div className={styles.popupContainer}>
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
    </div>
  );
};

export default Popup;
