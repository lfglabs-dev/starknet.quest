import React from "next";
import type { Metadata, Viewport } from "next";
import { Providers } from "./provider";
import "@styles/globals.css";
import Navbar from "@components/UI/navbar";
import Footer from "@components/UI/footer";

export const metadata: Metadata = {
  title: "Starknet Quest",
  description:
    "Starknet Quest helps protocols attract and retain users by creating gamified quest experiences on Starknet.",
  metadataBase: process.env.NEXT_PUBLIC_APP_LINK ? new URL(process.env.NEXT_PUBLIC_APP_LINK) : undefined,
  openGraph: {
    title: "Starknet Quest - Accomplish quests to get unique NFTs.",
    description:
      "Starknet Quest help protocols attract and retain users by creating gamified quest experiences on Starknet.",
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
      "Starknet Quest help protocols attract and retain users by creating gamified quest experiences on Starknet.",
    images: ["/visuals/starknetquest.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6affaf",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="default_background_color">
        <Providers>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
