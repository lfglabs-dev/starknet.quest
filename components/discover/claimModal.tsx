import React, { useCallback, useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import styles from "@styles/components/popup.module.css";
import Typography from "@components/UI/typography/typography";
import Button from "@components/UI/button";
import { CDNImg } from "@components/cdn/image";
import { TEXT_TYPE } from "@constants/typography";
import AppIcon from "./appIcon";
import TokenIcon from "./tokenIcon";
import { useNotification } from "@context/NotificationProvider";
import Loading from "@app/loading";

type RewardItem = {
  appName: string,
  currencies: { currencyName: string, value: number }[]
}

type CurrencyRowProps = {
  currencyName: string;
  currencyValue: number;
}

type ClaimModalProps = {
  closeModal: () => void;
  showSuccess: () => void;
  open: boolean;
};

const RewardComponent: FunctionComponent<RewardItem> = ({ appName, currencies }) => (
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

const CurrencyRow: FunctionComponent<CurrencyRowProps> = ({ currencyName, currencyValue }) => (
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
  showSuccess,
  open
}) => {
  const [claimRewards, setClaimRewards] = useState<RewardItem[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { showNotification } = useNotification();

  const getClaimRewards = useCallback(async () => {
    // TODO: Implement fetch from backend. Returning mock values.
    try {
      setLoading(true);
      const rewards = [
        {
          appName: "EKUBO",
          currencies: [
            { currencyName: "STRK", value: 11570 }
          ],
        },
        {
          appName: "NOSTRA",
          currencies: [
            { currencyName: "STRK", value: 12.124 },
            { currencyName: "ETH", value: 1.1245 }
          ],
        },
        {
          appName: "zkLend",
          currencies: [
            { currencyName: "USDT", value: 124.12 }
          ],
        },
        {
          appName: "VESU",
          currencies: [
            { currencyName: "STRK", value: 36 }
          ],
        },
        {
          appName: "Nimbora",
          currencies: [
            { currencyName: "STRK", value: 70.145 }
          ],
        },
        {
          appName: "zkLend",
          currencies: [
            { currencyName: "USDT", value: 124.12 }
          ],
        },
        {
          appName: "VESU",
          currencies: [
            { currencyName: "STRK", value: 36 }
          ],
        },
        {
          appName: "Nimbora",
          currencies: [
            { currencyName: "STRK", value: 70.145 }
          ],
        },
      ];
      const res = await new Promise<RewardItem[]>(resolve => setTimeout(() => resolve(rewards), 2000));
      setClaimRewards(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showNotification("Error while fetching rewards", "error");
      console.log("Error while fetching rewards", error);
    }
  }, []);

  const doClaimRewards = useCallback(async () => {
    // TODO: Implement logic to claim rewards
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      closeModal();
      showSuccess();
    } catch (error) {
      setLoading(false);
      showNotification("Error while claiming rewards", "error");
      console.log("Error while claiming rewards", error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      getClaimRewards();
    }
  }, [open, getClaimRewards]);

  return (
    <Modal
      disableAutoFocus
      onClose={closeModal}
      aria-label="Reward claim success modal"
      open={open}
    >
      <div className={`${styles.popup} !overflow-y-hidden !rounded-2xl !mt-0 !px-1 !py-1 md:!px-0 md:!py-0`}>
        <Loading isLoading={loading} loadingType="spinner">
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
                  aria-label="Starknet logo"
                  className="border border-white rounded-full w-12 h-12 aspect-square"
                  style={{ transform: "rotateY(190deg)" }}
                />
              </div>
              <div className="flex w-full flex-col mt-4 max-h-80 overflow-auto">
                {!claimRewards ?
                  <Typography type={TEXT_TYPE.BODY_DEFAULT}>No rewards available</Typography>
                  :
                  claimRewards.map((item, index) => (
                    <RewardComponent key={index} appName={item.appName} currencies={item.currencies} />
                  ))}
              </div>
            </div>
          </div>
          <div className={`${styles.bottomContent} !gap-6 !py-6 !px-5`}>
            <div className="flex w-full justify-between items-center">
              <button onClick={closeModal} aria-label="Cancel claiming rewards">
                <Typography type={TEXT_TYPE.BODY_MIDDLE}>
                  Cancel
                </Typography>
              </button>
              <div className="w-fit">
                <Button disabled={claimRewards ? false : true}
                  onClick={doClaimRewards}
                >
                  Claim all
                </Button>
              </div>
            </div>
          </div>
        </Loading>
      </div>
    </Modal>
  );
};

export default ClaimModal;