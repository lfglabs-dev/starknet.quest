import React from "react";
import { BridgeIcon } from "./icons/bridge";
import { SwapIcon } from "./icons/swap";
import { ApyIcon } from "./icons/apy";
import { AprIcon } from "./icons/apr";
import { TvlIcon } from "./icons/tvl";
import { ImpermanentLossIcon } from "./icons/impermanent-loss";
import { CollateralIcon } from "./icons/collateral";
import { LendBorrow } from "./icons/lend-borrow";
import { SupplyIcon } from "./icons/supply";
import { YieldFarmingIcon } from "./icons/yield-farming";
import { StakeIcon } from "./icons/stake";
import { ProvideLiquidityIcon } from "./icons/provide-liquidity";

interface DefiConcept {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface DiscoverCard {
  title: string;
  image: string;
  link: string;
}

export const DEFI_CONCEPTS: DefiConcept[] = [
  {
    title: "Provide liquidity",
    description: "Add token pairs to pools and earn fees from trades",
    icon: <ProvideLiquidityIcon />,
  },
  {
    title: "Stake",
    description: "Lock tokens to earn passive rewards and voting rights",
    icon: <StakeIcon />,
  },
  {
    title: "Yield Farming",
    description: "Earn additional tokens by participating in DeFi protocols",
    icon: <YieldFarmingIcon />,
  },
  {
    title: "Supply",
    description: "Deposit assets into a protocol to earn yield",
    icon: <SupplyIcon />,
  },
  {
    title: "Lend & Borrow",
    description: "Supply assets to earn interest or borrow against collateral",
    icon: <LendBorrow />,
  },
  {
    title: "Collateral",
    description: "Assets deposited as security for borrowing",
    icon: <CollateralIcon />,
  },
  {
    title: "Impermanent Loss",
    description: "Potential loss when providing liquidity compared to holding",
    icon: <ImpermanentLossIcon />,
  },
  {
    title: "TVL",
    description: "Total value of assets deposited in a protocol",
    icon: <TvlIcon />,
  },
  {
    title: "APR",
    description: "Simple interest rate earned over one year",
    icon: <AprIcon />,
  },
  {
    title: "APY",
    description: "Compound interest rate earned over one year",
    icon: <ApyIcon />,
  },
  {
    title: "Swap",
    description: "Exchange one token for another at market price",
    icon: <SwapIcon />,
  },
  {
    title: "Bridge",
    description: "Transfer assets between different blockchains",
    icon: <BridgeIcon />,
  },
];

export const DISCOVER_DEFI: Record<string, DiscoverCard[]> = {
  "Yield Strategies": [
    /*
     * Public have folders for each ecosystem project, put your icon images there and pass it.
     * Remove this comment and "discoverDefiDummyImg" file from public when done.
     */
    {
      title: "Title",
      image: "/discoverDefiDummyImg.svg",
      link: "https://google.com",
    }
  ],
  "Lending & Borrowing": [
    
  ],
  "Liquid Staking": [
    
  ],
  "Perpetuals & Derivatives": [
    
  ],
  "AMM & DEX": [
    
  ],
  "Wallets, Bridges & On-Ramps": [
    
  ],
  "Insurance & Risk Management": [
   
  ],
  "Real World Assets (RWA)": [
   
  ],
  "Payments": [
    
  ],
};
