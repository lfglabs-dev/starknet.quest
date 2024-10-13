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
import { useAccount, useContractWrite } from "@starknet-react/core";
import { RewardsPerProtocol } from "../../types/backTypes";
import { getRewards } from "@services/apiService";
import { gweiToEth } from "@utils/feltService";

type RewardItem = {
  appName: string;
  currencies: { currencyName: string; value: number }[];
};

type CurrencyRowProps = {
  currencyName: string;
  currencyValue: number;
};

type ClaimModalProps = {
  closeModal: () => void;
  showSuccess: () => void;
  open: boolean;
};

const RewardComponent: FunctionComponent<RewardItem> = ({
  appName,
  currencies,
}) => (
  <div className="flex w-full justify-between items-center bg-background px-4 py-3 my-1 rounded-lg">
    <div className="flex flex-row gap-4">
      <AppIcon
        app={appName}
        imageDimensions={{
          width: 25,
          height: 25,
        }}
        customStyle={{
          border: ".5px solid #fff",
        }}
      />
      <Typography type={TEXT_TYPE.BODY_MIDDLE}>
        <span className="capitalize">{appName}</span>
      </Typography>
    </div>
    <div className="flex w-fit flex-col items-end">
      {currencies.map((currency, idx) => (
        <CurrencyRow
          key={idx}
          currencyName={currency.currencyName}
          currencyValue={currency.value}
        />
      ))}
    </div>
  </div>
);

const CurrencyRow: FunctionComponent<CurrencyRowProps> = ({
  currencyName,
  currencyValue,
}) => (
  <div className="flex flex-row items-center gap-4">
    <Typography type={TEXT_TYPE.BODY_SMALL}>
      {currencyValue < 1000 ? currencyValue : `${currencyValue / 1000}K`}
    </Typography>
    <Typography type={TEXT_TYPE.BODY_SMALL}>{currencyName}</Typography>
    <TokenIcon token={currencyName} />
  </div>
);

const ClaimModal: FunctionComponent<ClaimModalProps> = ({
  closeModal,
  showSuccess,
  open,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { showNotification } = useNotification();
  const { address } = useAccount();
  const [rewards, setRewards] = useState<RewardsPerProtocol | null>(null);
  const [calls, setCalls] = useState<Call[]>();
  const { writeAsync: execute } = useContractWrite({
    calls: calls || [],
  });

  useEffect(() => {
    if (!address) return;
    getRewards(address).then((res) => {
      setRewards(res?.rewards);
      setCalls(res?.calls);
      setLoading(false);
    });
  }, [address]);

  const doClaimRewards = useCallback(async () => {
    // TODO: Implement logic to claim rewards
    try {
      setLoading(true);
      await execute();
      setLoading(false);
      closeModal();
      showSuccess();
    } catch (error) {
      setLoading(false);
      showNotification("Error while claiming rewards", "error");
      console.log("Error while claiming rewards", error, calls);
    }
  }, [calls]);

  return (
    <Modal
      disableAutoFocus
      onClose={closeModal}
      aria-label="Reward claim success modal"
      open={open}
    >
      <div
        className={`${styles.popup} !overflow-y-hidden !rounded-2xl !mt-0 !px-1 !py-1 md:!px-0 md:!py-0`}
      >
        <Loading isLoading={loading} loadingType="spinner">
          <div
            className={`${styles.popupContent} !px-0 !pt-6 !pb-0 md:!px-12 md:!pt-14`}
          >
            <div className="flex w-full flex-col self-start">
              <div className="flex w-full lg:flex-row flex-col-reverse lg:items-start items-center justify-between gap-4 md:pb-2">
                <div className="flex flex-col gap-4 lg:text-left text-center">
                  <Typography type={TEXT_TYPE.BODY_MIDDLE}>
                    Collect your rewards from all supported protocols on
                    Starknet
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
              <div className="flex w-full flex-col py-4 max-h-80 overflow-auto">
                {!rewards ? (
                  <Typography type={TEXT_TYPE.BODY_DEFAULT}>
                    No rewards available
                  </Typography>
                ) : (
                  Object.keys(rewards)
                    .map((key) =>
                      rewards[key as keyof RewardsPerProtocol].length > 0 ? (
                        <RewardComponent
                          key={key}
                          appName={key}
                          currencies={rewards[
                            key as keyof RewardsPerProtocol
                          ].map((reward) => {
                            return {
                              currencyName: reward.token_symbol,
                              value:
                                Math.round(
                                  parseFloat(gweiToEth(reward.amount)) * 100
                                ) / 100,
                            };
                          })}
                        />
                      ) : null
                    )
                    .flat()
                )}
              </div>
            </div>
          </div>
          <div className={`${styles.bottomContent} !gap-6 !py-6 !px-5`}>
            <div className="flex w-full justify-between items-center">
              <button onClick={closeModal} aria-label="Cancel claiming rewards">
                <Typography type={TEXT_TYPE.BODY_MIDDLE}>Cancel</Typography>
              </button>
              <div className="w-fit">
                <Button
                  disabled={calls ? false : true}
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
