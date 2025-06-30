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
      title: "Bountive",
      image: "/bountive/favicon.ico",
      link: "https://www.bountive.fi/",
    },
    {
      title: "Hashstack",
      image: "/hashstack/favicon.ico",
      link: "https://app.hashstack.finance/v1/",
    },
    {
      title: "Nimbora",
      image: "/nimbora/favicon.ico",
      link: "https://www.nimbora.io/",
    },
    {
      title: "STRKFarm",
      image: "/strkfarm/favicon-96x96.png",
      link: "https://app.strkfarm.com/",
    },
  ],
  "Lending & Borrowing": [
    {
      title: "Nostra",
      link: "https://nostra.finance/",
      image: "/nostra/nostraIcon.svg",
    },
    {
      title: "Opus",
      link: "https://app.opus.money/",
      image: "/opus/opusIcon.svg",
    },
    {
      title: "Vesu",
      link: "https://vesu.xyz/",
      image: "/vesu/vesuIcon.svg",
    },
    {
      title: "zkLend",
      link: "https://zklend.com/",
      image: "/zklend/zklendIcon.svg",
    },
  ],
  "Liquid Staking": [
    {
      title: "Endurfi",
      link: "https://app.endur.fi/",
      image: "/endurfi/endurfiIcon.svg",
    },
  ],
  "Perpetuals & Derivatives": [
    {
      title: "EdgeX",
      link: "https://www.edgex.exchange/en",
      image: "/edgex.png",
    },
    {
      title: "Extended",
      link: "https://app.extended.exchange/perp",
      image: "/extended.png",
    },
    {
      title: "GokuHub",
      link: "https://gokuhub.com/",
      image: "/gokuhub.png",
    },
    {
      title: "Paradex",
      link: "https://www.paradex.trade/",
      image: "/paradex.png",
    },
  ],
  "AMM & DEX": [
    {
      title: "10K",
      image: "/AMM-DEX/10kswap.svg",
      link: "https://www.10kx.com/",
    },
    {
      title: "AVNU",
      image: "/AMM-DEX/Avnu.svg",
      link: "https://app.avnu.fi/en",
    },
    {
      title: "Carmine Options",
      image: "/AMM-DEX/CarmineOptions.svg",
      link: "https://www.carmine.finance/",
    },
    {
      title: "Ekubo",
      image: "/AMM-DEX/Ebubo.svg",
      link: "https://ekubo.org/",
    },
    {
      title: "Fibrous",
      image: "/AMM-DEX/Fibrous.svg",
      link: "https://fibrous.finance/",
    },
    {
      title: "Haiko",
      image: "/AMM-DEX/Haiko.svg",
      link: "https://www.haiko.xyz/",
    },
    {
      title: "JediSwap",
      image: "/AMM-DEX/JediSwap.svg",
      link: "https://www.jediswap.xyz/",
    },
    {
      title: "Layer Akira",
      image: "/AMM-DEX/LayerAkira.svg",
      link: "https://layerakira.xyz/",
    },
    {
      title: "MySwap",
      image: "/AMM-DEX/MySwap.svg",
      link: "https://www.myswap.xyz/",
    },
    {
      title: "OpenOcean",
      image: "/AMM-DEX/OpenOcean.svg",
      link: "https://openocean.finance/",
    },
    {
      title: "SimpleSwap",
      image: "/AMM-DEX/SimpleSwap.svg",
      link: "https://simpleswap.io/",
    },
    {
      title: "SithSwap",
      image: "/AMM-DEX/SithSwap.svg",
      link: "https://sithswap.com/",
    },
    {
      title: "StarkDefi",
      image: "/AMM-DEX/StarkDefi.svg",
      link: "https://www.starkdefi.com/",
    },
  ],
  "Wallets, Bridges & On-Ramps": [
    {
      title: "Starkgate",
      image: "/starknet/starknet2.png",
      link: "https://starkgate.starknet.io/"
    },
    {
      title: "Argent",
      image: "/argent/image.png",
      link: "https://www.argent.xyz/"
    },
    {
      title: "Banxa",
      image: "/banxa/banxa.png",
      link: "https://banxa.com/"
    },
    {
      title: "Bitget",
      image: "/bitget/image.png",
      link: "https://www.bitget.com/"
    },
    {
      title: "Braavos",
      image: "/braavos/bravous.png",
      link: "https://braavos.app/"
    },
    {
      title: "Cartridge",
      image: "/cartridge/image.png",
      link: "https://cartridge.gg/"
    },
    {
      title: "Chaineye Mini Bridge",
      image: "/chaineye/image.png",
      link: "https://minibridge.chaineye.tools/"
    },
    {
      title: "Dfns",
      image: "/dfns/image.png",
      link: "https://www.dfns.co/"
    },
    {
      title: "Keplr",
      image: "/Kepir/image (1).png",
      link: "https://www.keplr.app/"
    },
    {
      title: "Layerswap",
      image: "/layerswap/image.png",
      link: "https://layerswap.io/"
    },
    {
      title: "Ledger",
      image: "/Ledger/image (1).png",
      link: "https://www.ledger.com/"
    },
    {
      title: "Metamask SNAPS",
      image: "/masks/image.png",
      link: "https://metamask.io/snaps/"
    },
    {
      title: "OKX",
      image: "/Okx/image (1).png",
      link: "https://www.okx.com/"
    },
    {
      title: "Onramp Money",
      image: "/Onramp/image.png",
      link: "https://onramp.money/"
    },
    {
      title: "Orbiter",
      image: "/orbiter/image (1).png",
      link: "https://www.orbiter.finance/en?src_chain=1&tgt_chain=10&src_token=ETH"
    },
    {
      title: "Owlto",
      image: "/Owito/image.png",
      link: "https://owlto.finance/"
    },
    {
      title: "Retrobridge",
      image: "/RetroBridge/image (1).png",
      link: "https://retrobridge.io/"
    },
    {
      title: "Rango",
      image: "/rango/rango.png",
      link: "https://rango.exchange/"
    },
    {
      title: "Ramp",
      image: "/pramb/image (1).png",
      link: "https://ramp.network/"
    },
    {
      title: "RhinoFi",
      image: "/rhino/image.png",
      link: "https://rhino.fi/"
    },
    {
      title: "Unlimit Crypto",
      image: "/Unlimit/image (1).png",
      link: "https://www.crypto.unlimit.com/"
    }
  ],
  "Insurance & Risk Management": [
    {
      title: "Pramb Insurance",
      link: "https://pramb.com/",
      image: "/pramb/pramb.svg",
    },
  ],
  "Real World Assets (RWA)": [],
  "Payments": [
    {
      title: "Kulipa",
      link: "https://www.kulipa.xyz/",
      image: "/icons/kulipa.svg",
    },
    {
      title: "Pulsar Money",
      link: "https://pulsar.money/",
      image: "/icons/pulsarmoney.svg",
    }
  ],
};
