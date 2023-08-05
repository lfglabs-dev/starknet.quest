import { NextPage } from "next";
import { useAccount, useConnectors } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Wallets from "../components/UI/wallets";
import ErrorScreen from "../components/UI/screens/errorScreen";

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
      <ErrorScreen
        errorMessage="You're not connected !"
        buttonText="Connect wallet"
        onClick={
          available.length === 1
            ? () => connect(available[0])
            : () => setHasWallet(true)
        }
      />
      <Wallets closeWallet={() => setHasWallet(false)} hasWallet={hasWallet} />
    </>
  );
};

export default NotConnected;
