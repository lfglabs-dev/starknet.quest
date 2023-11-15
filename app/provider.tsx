"use client";

import { WebWalletConnector } from "@argent/starknet-react-webwallet-connector";
import { goerli, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  alchemyProvider,
  argent,
  braavos,
} from "@starknet-react/core";
import { useMemo } from "react";
import { StarknetIdJsProvider } from "../context/StarknetIdJsProvider";
import { ThemeProvider, createTheme } from "@mui/material";
import { QuestsContextProvider } from "../context/QuestsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const chains = [
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? goerli : mainnet,
  ];
  const providers = alchemyProvider({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string,
  });

  const connectors = useMemo(
    () => [
      braavos(),
      argent(),
      new WebWalletConnector({
        url:
          process.env.NEXT_PUBLIC_IS_TESTNET === "true"
            ? "https://web.hydrogen.argent47.net"
            : "https://web.argent.xyz/",
      }),
    ],
    []
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
      provider={providers}
      connectors={connectors as any}
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
