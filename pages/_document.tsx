import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <link rel="icon" href="/visuals/starknetquestLogo.svg" />
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6affaf" />
        <meta
          property="og:site_name"
          content="Starknet Quest - Grow your Starknet profile with quests"
        />
      </Head>

      <body className="default_background_color">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
