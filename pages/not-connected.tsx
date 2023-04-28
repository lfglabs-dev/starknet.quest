import { NextPage } from "next";
import styles from "../styles/profile.module.css";
import { useAccount, useConnectors } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "../components/UI/button";
import Wallets from "../components/UI/wallets";

const NotConnected: NextPage = () => {
  const { address } = useAccount();
  const { available, connect } = useConnectors();
  const { push } = useRouter();
  const [hasWallet, setHasWallet] = useState<boolean>(true);

  useEffect(() => {
    if (address) push(`/${address}`);
  }, [address]);

  return (
    <>
      <div className={`h-screen flex justify-center items-center flex-col`}>
        <h2 className={`${styles.notFound} ${styles.name} mb-5`}>
          You&apos;re not connected
        </h2>
        <div className="text-background ml-5 mr-5">
          <Button
            onClick={
              available.length === 1
                ? () => connect(available[0])
                : () => setHasWallet(true)
            }
          >
            Connect
          </Button>
        </div>
      </div>
      <Wallets closeWallet={() => setHasWallet(false)} hasWallet={hasWallet} />
    </>
  );
};

export default NotConnected;
