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

type RewardItem = {
  appName: string, 
  currencies: {currencyName: string, value: number}[]
}

type CurrencyRowProps = {
  currencyName: string;
  currencyValue: number;
}

type ClaimModalProps = {
  closeModal: () => void;
  claimRewards: () => void;
  open: boolean;
  rewards: RewardItem[];
};

const RewardComponent: FunctionComponent<RewardItem> = ({appName, currencies}) => (
  <div className="flex w-full justify-between items-center bg-background px-2 py-3 my-1 rounded-lg">
    <div className="flex flex-row gap-4">
      <AppIcon app={appName} />
      <Typography type={TEXT_TYPE.BODY_MIDDLE}>
        {appName}
      </Typography>
    </div>
    <div className="flex w-fit flex-col items-end">
      {currencies.map((currency, idx) => (
        <CurrencyRow key={idx} currencyName={currency.currencyName} currencyValue={currency.value} />
      ))}
    </div>
  </div>
);

const CurrencyRow: FunctionComponent<CurrencyRowProps> = ({currencyName, currencyValue}) => (
  <div className="flex flex-row items-center gap-4">
    <Typography type={TEXT_TYPE.BODY_SMALL}>
      {currencyValue < 1000 ? currencyValue : `${currencyValue / 1000}K`}
    </Typography>
    <Typography type={TEXT_TYPE.BODY_SMALL}>
      {currencyName}
    </Typography>
    <TokenIcon token={currencyName} />
  </div>
);

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
      aria-label="Reward claim success modal"
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
                <RewardComponent key={index} appName={item.appName} currencies={item.currencies} />
              ))}
            </div>
          </div>
        </div>
        <div className={`${styles.bottomContent} !gap-6 !py-6 !px-5`}>
          <div className="flex w-full justify-between items-center">
            <button onClick={() => closeModal()} aria-label="Cancel claiming rewards">
              <Typography type={TEXT_TYPE.BODY_MIDDLE}>
                Cancel
              </Typography>
            </button>
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