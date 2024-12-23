import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Starknet Quest",
  description:
    "Starknet Quest helps protocols attract and retain users by creating gamified quest experiences on Starknet.",
  metadataBase: process.env.NEXT_PUBLIC_APP_LINK
    ? new URL(process.env.NEXT_PUBLIC_APP_LINK)
    : undefined,
  openGraph: {
    title: "Starknet Quest - Accomplish quests to get unique NFTs.",
    description:
      "Starknet Quest helps protocols attract and retain users by creating gamified quest experiences on Starknet.",
    url: process.env.NEXT_PUBLIC_APP_LINK,
    siteName: "Starknet Quest",
    images: [
      {
        url: "/visuals/starknetquest.webp",
        width: 680,
        height: 680,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/visuals/starknetquestLogo.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starknet Quest - Accomplish quests to get unique NFTs.",
    description:
      "Starknet Quest helps protocols attract and retain users by creating gamified quest experiences on Starknet.",
    images: ["/visuals/starknetquest.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6affaf",
};
