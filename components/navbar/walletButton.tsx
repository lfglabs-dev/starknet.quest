import React, { FunctionComponent, useMemo, useState, useEffect } from "react";
import Button from "@components/UI/button";
import { useDisplayName } from "@hooks/displayName.tsx";
import { useAccount } from "@starknet-react/core";
import styles from "@styles/components/navbar.module.css";
import ProfilIcon from "@components/UI/iconsComponents/icons/profilIcon";
import theme from "@styles/theme";
import Avatar from "@components/UI/avatar";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import WalletIcon from "@mui/icons-material/Wallet";
import LogoutIcon from "@mui/icons-material/Logout";
import VerifiedIcon from "@components/UI/iconsComponents/icons/verifiedIcon";
import ArgentIcon from "@components/UI/iconsComponents/icons/argentIcon";
import { useNotificationManager } from "@hooks/useNotificationManager";
import { CircularProgress } from "@mui/material";
import { getCurrentNetwork } from "@utils/network";
import Link from "next/link";
import TrophyIcon from "@components/UI/iconsComponents/icons/trophyIcon";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import { Connector } from "starknetkit";

type WalletButtonProps = {
  setShowWallet: (showWallet: boolean) => void;
  showWallet: boolean;
  connect: () => void;
  disconnectByClick: () => void;
};

const WalletButton: FunctionComponent<WalletButtonProps> = ({
  setShowWallet,
  showWallet,
  connect,
  disconnectByClick,
}) => {
  const currentNetwork = getCurrentNetwork();
  const { address, connector } = useAccount();
  const { notifications, checkTransactionStatus } = useNotificationManager();
  const domainOrAddressMinified = useDisplayName(address ?? "");
  const [txLoading, setTxLoading] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [unfocus, setUnfocus] = useState<boolean>(false);
  const network = currentNetwork === "TESTNET" ? "testnet" : "mainnet";
  const isWebWallet = (connector as Connector)?.wallet?.id === "argentWebWallet";

  const buttonName = useMemo(
    () =>
      address
        ? txLoading
          ? `${txLoading} on hold`
          : domainOrAddressMinified
        : "connect",
    [address, domainOrAddressMinified, txLoading]
  );

  useEffect(() => {
    if (notifications) {
      const fileredNotifications = notifications.filter(
        (notif: SQNotification<TransactionData>) =>
          notif.data.status === "pending"
      );
      fileredNotifications.forEach((notif) => {
        checkTransactionStatus(notif.data.hash);
      });
    }
  }, [notifications, checkTransactionStatus]);

  useEffect(() => {
    if (notifications) {
      // Give the number of tx that are loading
      setTxLoading(
        notifications.filter(
          (notif: SQNotification<TransactionData>) =>
            notif.data.status === "pending"
        ).length
      );
    }
  }, [notifications]);

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
    setHovering(false);
    setUnfocus(true);
    connect();
  };

  const handleOpenWebWallet = () => {
    window.open(
      network === "mainnet"
        ? "https://web.argent.xyz"
        : "https://web.hydrogen.argent47.net",
      "_blank",
      "noopener noreferrer"
    );
  };

  useEffect(() => {
    if (!unfocus) return;
    if (hovering) setUnfocus(false);
    else setShowWallet(false);
  }, [unfocus, hovering]);

  return (
    <>
      <div
        className={styles.buttonContainer}
        aria-label={address ? "connected" : "not connected"}
        aria-selected={showWallet}
        onBlur={() => setUnfocus(true)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Button
          onClick={address ? () => setShowWallet(!showWallet) : () => connect()}
        >
          <>
            <div className="flex items-center justify-between">
              <div className={styles.buttonTextSection}>
                <Typography type={TEXT_TYPE.BODY_DEFAULT} className={styles.buttonText}>{buttonName}</Typography>
                {txLoading ? (
                  <CircularProgress color="secondary" size={24} />
                ) : null}
                <div className={styles.buttonSeparator} />
              </div>
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
                <Link href="/leaderboard">
                  <button>
                    <TrophyIcon width="24" />
                    <Typography type={TEXT_TYPE.BUTTON_SMALL} color="secondary500">Leaderboard</Typography>
                  </button>
                </Link>
                <button onClick={copyAddress}>
                  {copied ? (
                    <VerifiedIcon width="24" />
                  ) : (
                    <CopyIcon width="24" />
                  )}
                  <Typography color="secondary500" type={TEXT_TYPE.BUTTON_SMALL}>Copy Address</Typography>
                </button>
                {isWebWallet && (
                  <button onClick={handleOpenWebWallet}>
                    <ArgentIcon width="24" />
                    <Typography type={TEXT_TYPE.BUTTON_SMALL} color="secondary500">Web wallet Dashboard</Typography>
                  </button>
                )}
                <button onClick={handleWalletChange}>
                  <WalletIcon width="24" />
                  <Typography type={TEXT_TYPE.BUTTON_SMALL} color="secondary500">Change Wallet</Typography>
                </button>
                <button onClick={handleDisconnect}>
                  <LogoutIcon width="24" />
                  <Typography type={TEXT_TYPE.BUTTON_SMALL} color="secondary500">Disconnect</Typography>
                </button>
              </div>
            ) : null}
          </>
        </Button>
      </div>
    </>
  );
};

export default WalletButton;
