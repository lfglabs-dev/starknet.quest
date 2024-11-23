import React from "react";
import { FunctionComponent } from "react";
import styles from "../../../../styles/components/icons.module.css";
import { getWalletInfo } from "@utils/walletConfig";

type WalletIconsProps = {
  id: string;
};

const WalletIcons: FunctionComponent<WalletIconsProps> = ({ id }) => {
  const walletInfo = getWalletInfo(id);
  return walletInfo?.icon ? (
    <img
      src={walletInfo.icon}
      alt={walletInfo.name}
      className={styles.button_icon}
    />
  ) : null;
};

export default WalletIcons;
