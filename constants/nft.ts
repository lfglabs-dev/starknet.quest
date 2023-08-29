import { LandsNFTsType } from "../types/nft";
import { hexToDecimal } from "../utils/feltService";

export const NFTContracts = [
  hexToDecimal(
    "0x076503062d78f4481be03c9145022d6a4a71ec0719aa07756f79a2384dc7ef16"
  ), // quest NFT Contract
  hexToDecimal(
    "0x01b22f7a9d18754c994ae0ee9adb4628d414232e3ebd748c386ac286f86c3066"
  ), // xplorer NFT Contract
  hexToDecimal(
    "0x067c358ec1181fc1e19daeebae1029cb478bb71917a5659a83a361c012fe3b6b"
  ), // braavos shield NFT Contract
  hexToDecimal(
    "0x00057c4b510d66eb1188a7173f31cccee47b9736d40185da8144377b896d5ff3"
  ), // braavos journey NFT Contract
];

export enum NFTKeys {
  Zklend = 0,
  AVNU = 1,
  JediSwap = 2,
  SIDShield = 3,
  SIDTotem = 4,
  // SithSwap = 5,
}

export enum WalletKeys {
  Braavos = "braavos",
  Argentx = "argentx",
}

export const soloBuildings = {
  "Zklend Artemis": 64001,
  "AVNU Astronaut": 64002,
  "JediSwap Light Saber": 64003,
  "Starknet ID Tribe Totem": 64004,
  "StarkFighter Bronze Arcade": 64005,
  "StarkFighter Silver Arcade": 64006,
  "StarkFighter Gold Arcade": 64007,
  "Sithswap Helmet": 64008,
  // 64000: "NFT_StarkID_6x4_H6",
};

export const LandsNFTs: LandsNFTsType = {
  braavos: {
    contract_address:
      "0x00057c4b510d66eb1188a7173f31cccee47b9736d40185da8144377b896d5ff3",
    levels: {
      2: ["NFT_BraavosMain_4x2_H5_1"],
      3: ["NFT_BraavosMain_4x2_H5_2"],
      4: ["NFT_BraavosMain_4x2_H6_3"],
      5: ["NFT_BraavosMain_4x2_H6_3", "NFT_BraavosOnboard_3x1_H3"],
      6: [
        "NFT_BraavosMain_4x2_H6_3",
        "NFT_BraavosOnboard_3x1_H3",
        "NFT_BraavosMobile_2x2_H3",
      ],
    },
    identifier: "NFT_BraavosMobile_2x2_H3",
    nft_names: [
      "Starknet Exchange Journey",
      "Starknet Mobile Journey",
      "Starknet Journey Map",
      "Starknet Onboarding Journey",
      "Starknet Journey Coin NFT",
      "Starknet Identity Journey",
    ],
  },
  argentx: {
    contract_address:
      "0x01b22f7a9d18754c994ae0ee9adb4628d414232e3ebd748c386ac286f86c3066",
    levels: {
      2: ["NFT_ArgentMain_4x3_H3_1"],
      3: ["NFT_ArgentMain_4x3_H4_2"],
      4: ["NFT_ArgentMain_4x3_H5_3"],
      5: ["NFT_ArgentMain_4x3_H5_3"],
      6: ["NFT_ArgentMain_4x3_H5_3", "NFT_ArgentExplorer_1_3x2_H4"],
      7: ["NFT_ArgentMain_4x3_H5_3", "NFT_ArgentExplorer_2_3x1_H3"],
      8: [
        "NFT_ArgentMain_4x3_H5_3",
        "NFT_ArgentExplorer_2_3x1_H3",
        "NFT_DappLand_3x2_H3",
      ],
    },
    nft_names: [
      "Xplorer — Argent",
      "Xplorer — Starkfighter",
      "Xplorer — Jediswap",
      "Xplorer — Mintsquare",
      "Xplorer — Layerswap",
      "Xplorer — Briq",
      "Xplorer — AVNU",
      "Xplorer — Dappland",
    ],
  },
  sq: {
    contract_address:
      "0x076503062d78f4481be03c9145022d6a4a71ec0719aa07756f79a2384dc7ef16",
    nft_names: [
      "StarkFighter Bronze Arcade",
      "StarkFighter Silver Arcade",
      "StarkFighter Gold Arcade",
      "AVNU Astronaut",
      "Starknet ID Tribe Totem",
      "Starknet ID Tribe Shield",
      "Zklend Artemis",
      "JediSwap Light Saber",
      // "Sithswap Helmet",
    ],
    levels: {
      starknetID: ["NFT_StarkID_6x4_H6"],
      starkFighterLevel: ["NFT_StarkFighter_4x2_H3_"],
      0: ["NFT_Zklend_3X2_H3"],
      1: ["NFT_Avnu_3x2_H3"],
      2: ["NFT_JediSwap_4x3_H7"],
      3: [""],
      4: ["NFT_TotemID_2X1_H3"],
      // 5: ["NFT_SithSwap_4x2_H3"],
    },
  },
};

export const assetMap: { [key: string]: number } = {
  "StarkFighter Bronze Arcade": 1,
  "StarkFighter Silver Arcade": 2,
  "StarkFighter Gold Arcade": 3,
  "AVNU Astronaut": NFTKeys.AVNU,
  "JediSwap Light Saber": NFTKeys.JediSwap,
  "Zklend Artemis": NFTKeys.Zklend,
  "Starknet ID Tribe Totem": NFTKeys.SIDTotem,
  "Starknet ID Tribe Shield": NFTKeys.SIDShield,
  // "Sithswap Helmet": NFTKeys.SithSwap,
};

// Additional NFTs [number_required_to_get_NFT: NFT name]
export const totalNFTsNamesMapping: { [key: number]: string } = {
  5: "NFT_StarkCoin_3x2_H2",
  10: "NFT_SushiRest_4x2_H2",
  15: "NFT_PepperBar_4x3_H2",
};
