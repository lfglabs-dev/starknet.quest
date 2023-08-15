import { hexToDecimal } from "./feltService";
import { NFTCounters } from "../types/nft";
import { LandsNFTs, NFTKeys, WalletKeys, assetMap } from "../constants/nft";

export const checkAssetInLands = (
  asset: StarkscanNftProps,
  targetSet: Set<string>,
  contractAddress: string,
  key: string,
  finalNFTCounters: NFTCounters
) => {
  if (
    hexToDecimal(asset.contract_address) === hexToDecimal(contractAddress) &&
    targetSet.has(asset.name as string)
  ) {
    if (key === WalletKeys.Braavos) {
      finalNFTCounters.braavosCounter++;
    } else if (key === WalletKeys.Argentx) {
      finalNFTCounters.argentxCounter++;
    }
    targetSet.delete(asset.name as string);
    finalNFTCounters.totalNFTs++;
  }
};

export const checkAssetInSq = (
  asset: StarkscanNftProps,
  finalNFTCounters: NFTCounters,
  finalNFTFlags: boolean[]
) => {
  if (
    hexToDecimal(asset.contract_address) !==
    hexToDecimal(LandsNFTs.sq.contract_address)
  )
    return;

  const assetKey = assetMap[asset.name as string];
  if (assetKey !== undefined) {
    if (asset.name?.startsWith("StarkFighter")) {
      if (finalNFTCounters.starkFighterLevel < assetKey) {
        finalNFTCounters.starkFighterLevel = assetKey;
        finalNFTCounters.totalNFTs++;
      }
    } else {
      if (assetKey in NFTKeys) {
        finalNFTFlags[assetKey] = true;
        finalNFTCounters.totalNFTs++;
      }
    }
  }
};

export const memberSince = (timestamp: number): string | null => {
  const then = new Date(timestamp * 1000);
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - then.getTime();
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

  const differenceInYears = Math.floor(differenceInSeconds / (3600 * 24 * 365));
  if (differenceInYears > 0) {
    return `Member since ${differenceInYears} ${
      differenceInYears > 1 ? "years" : "year"
    }`;
  }

  const differenceInMonths = Math.floor(differenceInSeconds / (3600 * 24 * 30));
  if (differenceInMonths > 0) {
    return `Member since ${differenceInMonths} ${
      differenceInMonths > 1 ? "months" : "month"
    }`;
  }

  const differenceInDays = Math.floor(differenceInSeconds / (3600 * 24));
  if (differenceInDays > 0) {
    return `Member since ${differenceInDays} ${
      differenceInDays > 1 ? "days" : "day"
    }`;
  }

  return null;
};
