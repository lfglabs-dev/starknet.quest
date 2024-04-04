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
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

// Traffic measures
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: "https://app.posthog.com",
    session_recording: {
      recordCrossOriginIframes: true,
    },
    capture_pageleave: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).posthog = posthog;
}

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    components: {
      MuiTabs: {
        styleOverrides: {
          root: {
            "& .MuiTabs-flexContainer": {
              display: "flex",
              flexDirection: "column", // For mobile versions
              ["@media (min-width:376px)"]: {
                flexDirection: "row", // For desktop versions
              },
            },
          },
          // Overrides the styles for the selected tab indicator
          indicator: {
            backgroundColor: "transparent",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          // Overrides the styles for unselected tabs
          root: {
            color: "#E1DCEA", // Text color for unselected tabs
            "&.Mui-selected": {
              color: "#000", // Text color for the selected tab
              backgroundColor: "#fff", // Background of the selected tab
            },
          },
        },
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
          <PostHogProvider client={posthog}>
            <QuestsContextProvider>{children}</QuestsContextProvider>
          </PostHogProvider>
        </ThemeProvider>
      </StarknetIdJsProvider>
    </StarknetConfig>
  );
}
