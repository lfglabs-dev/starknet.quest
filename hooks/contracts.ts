import { Abi } from "starknet";
import quests_nft_abi from "../abi/quests_nft_abi.json";
import { useContract } from "@starknet-react/core";

export function useQuestsNFTContract() {
  return useContract({
    abi: quests_nft_abi as Abi,
    address: process.env.NEXT_PUBLIC_IS_TESTNET
      ? process.env.NEXT_PUBLIC_QUESTS_CONTRACT_TESTNET
      : process.env.NEXT_PUBLIC_QUESTS_CONTRACT_MAINNET,
  });
}
