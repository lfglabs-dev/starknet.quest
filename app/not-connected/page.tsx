"use client";

import { useAccount, useConnect, Connector } from "@starknet-react/core";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorScreen from "@components/UI/screens/errorScreen";
import { useStarknetkitConnectModal } from "starknetkit";
import { availableConnectors } from "@app/provider";

export default function Page() {
  const { address } = useAccount();
  const { connectAsync } = useConnect();
  const { push } = useRouter();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: availableConnectors as any,
    modalTheme: "dark",
  });

  useEffect(() => {
    if (address) push(`/${address}`);
  }, [address]);

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connectAsync({ connector: connector as Connector }); // Type casted
    localStorage.setItem("SQ-connectedWallet", connector.id);
  };

  return (
    <>
      <ErrorScreen
        errorMessage="You're not connected!"
        buttonText="Connect wallet"
        onClick={connectWallet}
      />
    </>
  );
}
