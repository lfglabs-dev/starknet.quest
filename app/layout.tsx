"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Providers } from "./provider";
import "@styles/globals.css";
import Navbar from "@components/UI/navbar";
import Footer from "@components/UI/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="default_background_color">
        <Providers>
          <Navbar />
          <main className="mt-[48px]">{children}</main>
          {pathname !== "/" && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
