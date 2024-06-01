import React, { FunctionComponent } from "react";
import styles from "@styles/components/popup.module.css";
import Button from "../button";
import CloseIcon from "../iconsComponents/icons/closeIcon";
import { Modal } from "@mui/material";
import { CDNImg } from "@components/cdn/image";
import Typography from "../typography/typography";
import type { TEXT_TYPE } from "@constants/typography";

type BannerPopupProps = {
  title: string;
  banner: string;
  description: string;
  buttonName: string;
  onClick: () => void;
  onClose?: () => void;
};

const BannerPopup: FunctionComponent<BannerPopupProps> = ({
  title,
  banner,
  description,
  buttonName,
  onClick,
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
      <div className={styles.bannerPopup}>
        <div className={styles.titleSide}>
          <Typography type={TEXT_TYPE.H1} color="secondary" className={styles.title}>{title}</Typography>
          <CDNImg className={styles.banner} src={banner} alt="banner" />
        </div>
        <div className={styles.contentSide}>
          <button className={styles.close} onClick={onClose}></button>
          <p className={styles.description}>{description}</p>
          <div className={styles.button}>
            <Button onClick={onClick}>{buttonName}</Button>
          </div>
        </div>
        {onClose && (
          <>
            <button onClick={onClose} className={styles.close}>
              <CloseIcon width="16" />
            </button>
            <p className={styles.closeMobile} onClick={onClose}>
              Close
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default BannerPopup;
