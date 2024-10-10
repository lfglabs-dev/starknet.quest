import React from "react";
import { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import styles from "@styles/components/popup.module.css";
import Typography from "@components/UI/typography/typography";
import Button from "@components/UI/button";
import { CDNImg } from "@components/cdn/image";
import { TEXT_TYPE } from "@constants/typography";
import AppIcon from "./appIcon";
import TokenIcon from "./tokenIcon";

type rewardItem = {
  appName: string, 
  currencies: {currencyName: string, value: number}[]
}

type ClaimModalProps = {
  closeModal: () => void;
  claimRewards: () => void;
  open: boolean;
  rewards: rewardItem[];
};

const ClaimModal: FunctionComponent<ClaimModalProps> = ({
  closeModal,
  claimRewards,
  open,
  rewards
}) => {
  return (
    <Modal
      disableAutoFocus
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
    >
      <div className={`${styles.popup} !overflow-y-hidden !rounded-2xl !mt-0 !px-1 !py-1 md:!px-0 md:!py-0`}>
        <div className={`${styles.popupContent} !px-0 !py-2 md:!px-12 md:!py-6`}>
          <div className="flex w-full flex-col self-start">
            <div className="flex w-full lg:flex-row flex-col-reverse lg:items-start items-center justify-between gap-4">
              <div className="flex flex-col gap-4 lg:text-left text-center">
                <Typography type={TEXT_TYPE.BODY_MIDDLE}>
                  Collect your rewards from all supported protocols on Starknet
                </Typography>
                <Typography type={TEXT_TYPE.H4}>
                  Claim Your Rewards
                </Typography>
              </div>
              <CDNImg
                src="/icons/strk.webp"
                alt="starknet icon"
                className="border border-white rounded-full w-12 h-12 aspect-square"
                style={{ transform: "rotateY(190deg)" }}
              />
            </div>
            <div className="flex w-full flex-col mt-4 max-h-80 overflow-auto">
              {rewards.map((item, index) => (
                <div
                  key={index}
                  className="flex w-full justify-between items-center bg-background px-2 py-3 my-1 rounded-lg"
                >
                  <div className="flex flex-row gap-4">
                    <AppIcon
                      app={item.appName}
                    />
                    <Typography type={TEXT_TYPE.BODY_MIDDLE}>
                      {item.appName}
                    </Typography>
                  </div>
                  <div className="flex w-fit flex-col items-end">
                    {item.currencies.map((currency, idx) => (
                      <div key={idx} className="flex flex-row items-center gap-4">
                        <Typography type={TEXT_TYPE.BODY_SMALL}>
                          {currency.value < 1000 ? currency.value : `${currency.value / 1000}K`}
                        </Typography>
                        <Typography type={TEXT_TYPE.BODY_SMALL}>
                          {currency.currencyName}
                        </Typography>
                        <TokenIcon
                          token={currency.currencyName}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`${styles.bottomContent} !gap-6 !py-6 !px-5`}>
          <div className="flex w-full justify-between items-center">
            <div className="modified-cursor-pointer" onClick={() => closeModal()}>
              <Typography type={TEXT_TYPE.BODY_MIDDLE}>
                Cancel
              </Typography>
            </div>
            <div className="w-fit">
              <Button
                onClick={() => claimRewards()}
              >
                Claim all
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimModal;

