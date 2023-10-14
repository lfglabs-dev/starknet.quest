import React, { FunctionComponent } from "react";
import styles from "../../../styles/components/popup.module.css";
import Button from "../button";
import CloseIcon from "../iconsComponents/icons/closeIcon";

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
    <div className={styles.popupContainer}>
      <div className={styles.bannerPopup}>
        <div className={styles.titleSide}>
          <h1 className={styles.title}>{title}</h1>
          <img className={styles.banner} src={banner} alt="banner" />
        </div>
        <div className={styles.contentSide}>
          <button className={styles.close} onClick={onClose}></button>
          <p className={styles.description}>{description}</p>
          <div className={styles.button}>
            <Button onClick={onClick}>{buttonName}</Button>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className={styles.close}>
            <CloseIcon width="16" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BannerPopup;
