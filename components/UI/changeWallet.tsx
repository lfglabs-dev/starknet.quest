import React from "react";
import styles from "@styles/components/wallets.module.css";
import { Connector, useConnect } from "@starknet-react/core";
import Button from "./button";
import { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import WalletIcons from "@components/UI/iconsComponents/icons/walletIcons";
import getDiscoveryWallets from "get-starknet-core";
import useGetDiscoveryWallets from "@hooks/useGetDiscoveryWallets";
import Typography from "./typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type ChangeWalletProps = {
  closeWallet: () => void;
  hasWallet: boolean;
};

const ChangeWallet: FunctionComponent<ChangeWalletProps> = ({
  closeWallet,
  hasWallet,
}) => {
  const { connect, connectors } = useConnect();
  const downloadLinks = useGetDiscoveryWallets(
    getDiscoveryWallets.getDiscoveryWallets()
  );

  function connectWallet(connector: Connector): void {
    connect({ connector });
    closeWallet();
  }

  return (
    <Modal
      disableAutoFocus
      open={hasWallet}
      onClose={closeWallet}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.menu}>
        <button
          className={styles.menu_close}
          onClick={() => {
            closeWallet();
          }}
        >
          <svg viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <Typography type={TEXT_TYPE.BODY_NORMAL} color="secondary" className={styles.menu_title}>Change wallet</Typography>
        {connectors.map((connector) => {
          if (connector.available()) {
            return (
              <div className="mt-5 flex justify-center" key={connector.id}>
                <Button onClick={() => connectWallet(connector)}>
                  <div className="flex justify-center items-center">
                    <WalletIcons id={connector.id} />
                    {connector.id === "braavos" ||
                    connector.id === "argentX" ||
                    connector.id === "okxwallet"
                      ? `Connect ${connector.name}`
                      : "Login with Email"}
                  </div>
                </Button>
              </div>
            );
          } else {
            if (connector.id === "braavos" || connector.id === "argentX") {
              return (
                <div className="mt-5 flex justify-center" key={connector.id}>
                  <Button
                    onClick={() =>
                      window.open(
                        `${
                          downloadLinks[
                            connector.id as keyof typeof downloadLinks
                          ]
                        }`
                      )
                    }
                  >
                    <div className="flex justify-center items-center">
                      <WalletIcons id={connector.id} />
                      Install {connector.id}
                    </div>
                  </Button>
                </div>
              );
            }
          }
        })}
        <Typography color="secondary" type={TEXT_TYPE.BODY_MIDDLE} onClick={() => closeWallet()} className={styles.closeMobile}>
          Close
        </Typography>
      </div>
    </Modal>
  );
};
export default ChangeWallet;
