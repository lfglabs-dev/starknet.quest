import React, { FunctionComponent, useMemo, useState, useEffect } from "react";
import Button from "../UI/button";
import { useDisplayName } from "../../hooks/displayName.tsx";
import {
  useAccount,
  useTransactionManager,
  useTransactions,
} from "@starknet-react/core";
import styles from "../../styles/components/navbar.module.css";
import ProfilIcon from "../UI/iconsComponents/icons/profilIcon";
import theme from "../../styles/theme";
import Avatar from "../UI/avatar";
import CopyIcon from "../UI/iconsComponents/icons/copyIcon";
import { Wallet } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import VerifiedIcon from "../UI/iconsComponents/icons/verifiedIcon";
import ChangeWallet from "../UI/changeWallet";

type WalletButtonProps = {
  setShowWallet: (showWallet: boolean) => void;
  showWallet: boolean;
  refreshAndShowWallet: () => void;
  disconnectByClick: () => void;
};

const WalletButton: FunctionComponent<WalletButtonProps> = ({
  setShowWallet,
  showWallet,
  refreshAndShowWallet,
  disconnectByClick,
}) => {
  const { address } = useAccount();
  const { hashes } = useTransactionManager();
  const transactions = useTransactions({ hashes, watch: true });
  const domainOrAddressMinified = useDisplayName(address ?? "");
  const [txLoading, setTxLoading] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [changeWallet, setChangeWallet] = useState<boolean>(false);
  const buttonName = useMemo(
    () =>
      address
        ? txLoading
          ? `${txLoading} on hold`
          : domainOrAddressMinified
        : "connect",
    [address, domainOrAddressMinified]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      for (const tx of transactions) {
        tx.refetch();
      }
    }, 3_000);
    return () => clearInterval(interval);
  }, [transactions?.length]);

  useEffect(() => {
    if (transactions) {
      // Give the number of tx that are loading (I use any because there is a problem on Starknet React types)
      setTxLoading(
        transactions.filter((tx) => (tx?.data as any)?.status === "RECEIVED")
          .length
      );
    }
  }, [transactions]);

  const copyAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCopied(true);
    navigator.clipboard.writeText(address ?? "");
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleDisconnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    disconnectByClick();
  };

  const handleWalletChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setChangeWallet(true);
  };

  return (
    <>
      <div
        className={styles.buttonContainer}
        aria-label={address ? "connected" : "not connected"}
        aria-selected={showWallet}
      >
        <Button
          onClick={
            address
              ? () => setShowWallet(!showWallet)
              : () => refreshAndShowWallet()
          }
        >
          <>
            <div className="flex items-center">
              <p className={styles.buttonText}>{buttonName}</p>
              <div className={styles.buttonSeparator} />
              <div className={styles.buttonIcon}>
                {address ? (
                  <Avatar address={address} />
                ) : (
                  <ProfilIcon
                    width="32"
                    color={theme.palette.background.default}
                  />
                )}
              </div>
            </div>
            {showWallet ? (
              <div className={styles.walletMenu}>
                <button onClick={copyAddress}>
                  {copied ? (
                    <VerifiedIcon width="24" />
                  ) : (
                    <CopyIcon width="24" />
                  )}
                  <p>Copy Address</p>
                </button>
                <button onClick={handleWalletChange}>
                  <Wallet width="24" />
                  <p>Change Wallet</p>
                </button>
                <button onClick={handleDisconnect}>
                  <LogoutIcon width="24" />
                  <p>Disconnect</p>
                </button>
              </div>
            ) : null}
          </>
        </Button>
      </div>
      <ChangeWallet
        closeWallet={() => setChangeWallet(false)}
        hasWallet={changeWallet}
      />
    </>
  );
};

export default WalletButton;
