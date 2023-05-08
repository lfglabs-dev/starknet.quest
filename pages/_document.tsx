import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <link rel="icon" href="/visuals/starknetquestLogo.svg" />
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6affaf" />
        <meta property="og:site_name" content="Starknet Quest" />

        <meta
          property="og:title"
          content="Starknet Quest - Accomplish quests to get unique NFTs."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Starknet Quest help protocols attract and retain users by creating gamified quest experiences on Starknet."
        />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_LINK} />
        <meta property="og:image" content="/visuals/starknetquest.webp" />
        <meta
          name="description"
          content="Starknet Quest help protocols attract and retain users by creating gamified quest experiences on Starknet."
        />
        {/* Twitter Meta Tags */}
        <meta
          name="twitter:title"
          content="Starknet Quest - Accomplish quests to get unique NFTs."
        />
        <meta
          name="twitter:description"
          content="Starknet Quest help protocols attract and retain users by creating gamified quest experiences on Starknet."
        />
        <meta name="twitter:image" content="/visuals/starknetquest.webp" />
        <link rel="icon" href="/visuals/starknetquestLogo.svg" />
      </Head>

      <body className="default_background_color">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
