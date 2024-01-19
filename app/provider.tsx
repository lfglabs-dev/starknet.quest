"use client";

import React, { useMemo } from "react";
import { WebWalletConnector } from "starknetkit/webwallet";
import { Chain, goerli, mainnet } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
} from "@starknet-react/core";
import { StarknetIdJsProvider } from "@context/StarknetIdJsProvider";
import { ThemeProvider, createTheme } from "@mui/material";
import { QuestsContextProvider } from "@context/QuestsProvider";
import { getCurrentNetwork } from "@utils/network";

export function Providers({ children }: { children: React.ReactNode }) {
  const network = getCurrentNetwork();
  const chains = [network === "TESTNET" ? goerli : mainnet];
  const provider = jsonRpcProvider({
    rpc: (_chain: Chain) => ({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
    }),
  });

  const connectors = useMemo(
    () => [
      braavos(),
      argent(),
      new WebWalletConnector({
        url:
          network === "TESTNET"
            ? "https://web.hydrogen.argent47.net"
            : "https://web.argent.xyz/",
      }),
    ],
    [network]
  );

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
      connectors={connectors as Connector[]}
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
