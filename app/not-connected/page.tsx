"use client";

import { useAccount } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Wallets from "@components/UI/wallets";
import ErrorScreen from "@components/UI/screens/errorScreen";

export default function Page() {
  const { address } = useAccount();
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
        onClick={() => setHasWallet(true)}
      />
      <Wallets closeWallet={() => setHasWallet(false)} hasWallet={hasWallet} />
    </>
  );
}
