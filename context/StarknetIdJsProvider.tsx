"use client";

import { getCurrentNetwork } from "@utils/network";
import React from "react";
import { ReactNode, createContext, useMemo } from "react";
import { Provider, constants } from "starknet";
import { StarknetIdNavigator } from "starknetid.js";

interface StarknetIdJsConfig {
  starknetIdNavigator: StarknetIdNavigator | null;
}

export const StarknetIdJsContext = createContext<StarknetIdJsConfig>({
  starknetIdNavigator: null,
});

export const StarknetIdJsProvider = ({ children }: { children: ReactNode }) => {
  const isTestnet = useMemo(() => {
    const network = getCurrentNetwork();
    return network === "TESTNET" ? true : false;
  }, []);

  const starknetIdNavigator = useMemo(() => {
    return new StarknetIdNavigator(
      new Provider({
        rpc: {
          nodeUrl: `https://starknet-${
            isTestnet ? "goerli" : "mainnet"
          }.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
        },
      }),
      isTestnet
        ? constants.StarknetChainId.SN_GOERLI
        : constants.StarknetChainId.SN_MAIN
    );
  }, []);

  const contextValues = useMemo(() => {
    return {
      starknetIdNavigator,
    };
  }, [starknetIdNavigator]);

  return (
    <StarknetIdJsContext.Provider value={contextValues}>
      {children}
    </StarknetIdJsContext.Provider>
  );
};
