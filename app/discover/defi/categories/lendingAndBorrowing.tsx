import { DefiCategoryCard } from "@components/discover/defiCategoryCard";
import React from "react";

const DeFis = [
  {
    title: "Nostra",
    url: "https://nostra.finance/",
    icon: "/icons/defi-categories/nostra.svg",
  },
  {
    title: "Opus",
    url: "https://app.opus.money/",
    icon: "/icons/defi-categories/opus.svg",
  },
  {
    title: "Vesu",
    url: "https://vesu.xyz/",
    icon: "/icons/defi-categories/vesu.svg",
  },
  {
    title: "zkLend",
    url: "https://zklend.com/",
    icon: "/icons/defi-categories/zklend.svg",
  },
];
export const LendingAndBorrowing = () => {
  return (
    <section className="flex flex-wrap items-center w-full gap-6 my-8">
      {DeFis.map((defi, index) => (
        <DefiCategoryCard {...defi} key={`${defi.title}-${defi.url}-${index}`} />
      ))}
    </section>
  );
};
