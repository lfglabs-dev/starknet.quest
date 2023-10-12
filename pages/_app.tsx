import React, { useMemo } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/UI/navbar";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import { InjectedConnector, StarknetConfig } from "@starknet-react/core";
import { Analytics } from "@vercel/analytics/react";
import { StarknetIdJsProvider } from "../context/StarknetIdJsProvider";
import { createTheme } from "@mui/material/styles";
import Footer from "../components/UI/footer";
import { QuestsContextProvider } from "../context/QuestsProvider";
import { WebWalletConnector } from "@argent/starknet-react-webwallet-connector";

function MyApp({ Component, pageProps }: AppProps) {
  const connectors = useMemo(
    () => [
      new InjectedConnector({ options: { id: "braavos" } }),
      new InjectedConnector({ options: { id: "argentX" } }),
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
    <StarknetConfig connectors={connectors} autoConnect>
      <StarknetIdJsProvider>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Starknet Quest</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <QuestsContextProvider>
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </QuestsContextProvider>
        </ThemeProvider>
        <Analytics />
      </StarknetIdJsProvider>
    </StarknetConfig>
  );
}

export default MyApp;
