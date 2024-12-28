"use client";

import React from "react";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
} from "@starknet-react/core";
import { StarknetIdJsProvider } from "@context/StarknetIdJsProvider";
import { ThemeProvider } from "@mui/material";
import { QuestsContextProvider } from "@context/QuestsProvider";
import { getCurrentNetwork } from "@utils/network";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { NotificationProvider } from "@context/NotificationProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getConnectors } from "@utils/walletConfig";
import theme from "@styles/theme";

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

export const availableConnectors = getConnectors();

export function Providers({ children }: { children: React.ReactNode }) {
  const network = getCurrentNetwork();
  const chains = [network === "TESTNET" ? sepolia : mainnet];
  const provider = jsonRpcProvider({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rpc: (_chain: Chain) => ({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
    }),
  });

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={availableConnectors as Connector[]}
      autoConnect
    >
      <StarknetIdJsProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <NotificationProvider>
            <ThemeProvider theme={theme}>
              <PostHogProvider client={posthog}>
                <QuestsContextProvider>{children}</QuestsContextProvider>
              </PostHogProvider>
            </ThemeProvider>
          </NotificationProvider>
        </LocalizationProvider>
      </StarknetIdJsProvider>
    </StarknetConfig>
  );
}
