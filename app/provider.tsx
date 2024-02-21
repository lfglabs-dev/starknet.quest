"use client";

import React from "react";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { Chain, goerli, mainnet } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
} from "@starknet-react/core";
import { StarknetIdJsProvider } from "@context/StarknetIdJsProvider";
import { ThemeProvider, createTheme } from "@mui/material";
import { QuestsContextProvider } from "@context/QuestsProvider";
import { getCurrentNetwork } from "@utils/network";
import { constants } from "starknet";

export const availableConnectors = [
  new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
  new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
  new WebWalletConnector({
    url:
      getCurrentNetwork() === "TESTNET"
        ? "https://web.hydrogen.argent47.net"
        : "https://web.argent.xyz/",
  }),
  new ArgentMobileConnector({
    dappName: "Starknet Quest",
    url: process.env.NEXT_PUBLIC_APP_LINK as string,
    chainId: constants.NetworkName.SN_MAIN,
    icons: ["https://starknet.quest/visuals/starknetquestLogo.svg"],
  }),
];

export function Providers({ children }: { children: React.ReactNode }) {
  const network = getCurrentNetwork();
  const chains = [network === "TESTNET" ? goerli : mainnet];
  const provider = jsonRpcProvider({
    rpc: (_chain: Chain) => ({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
    }),
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: "#6affaf",
        light: "#5ce3fe",
      },
      secondary: {
        main: "#f4faff",
        dark: "#eae0d5",
      },
      background: {
        default: "#29282b",
      },
    },
  });

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={availableConnectors as Connector[]}
      autoConnect
    >
      <StarknetIdJsProvider>
        <ThemeProvider theme={theme}>
          <QuestsContextProvider>{children}</QuestsContextProvider>
        </ThemeProvider>
      </StarknetIdJsProvider>
    </StarknetConfig>
  );
}
