import React from "react";
import { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import styles from "@styles/components/popup.module.css";
import { CDNImg } from "@components/cdn/image";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "@components/UI/typography/typography";
import Button from "@components/UI/button";

type SuccessModalProps = {
  closeModal: () => void;
  open: boolean;
};

const SuccessModal: FunctionComponent<SuccessModalProps> = ({
  closeModal,
  open
}) => {
  return (
    <Modal
      disableAutoFocus
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
    >
      <div className={`${styles.popup} !overflow-y-hidden !rounded-2xl !mt-0 !px-4 !py-4 md:!py-0 md:!px-0`}>
        <div className={`${styles.popupContent} !px-1 !py-3 md:!px-12 md:!py-8`}>
          <div className="flex w-fit flex-col items-center text-center">
            <Typography type={TEXT_TYPE.H4}>
              You've claimed all your rewards with success!
            </Typography>
            <CDNImg
              src="/icons/success.svg"
              alt="success icon"
              width={256}
              height={256}
              className="object-contain"
            />
          </div>
        </div>
        <div className={`${styles.bottomContent} !gap-6 !py-6 !px-5`}>
          <div className="flex w-fit items-center">
            <Button onClick={closeModal}>Thanks</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;