import { Abi } from "starknet";
import quests_nft_abi from "@abi/quests_nft_abi.json";
import { useContract } from "@starknet-react/core";
import { getCurrentNetwork } from "@utils/network";

export function useQuestsNFTContract() {
  const network = getCurrentNetwork();
  return useContract({
    abi: quests_nft_abi as Abi,
    address:
      network === "TESTNET"
        ? process.env.NEXT_PUBLIC_QUESTS_CONTRACT_TESTNET
        : process.env.NEXT_PUBLIC_QUESTS_CONTRACT_MAINNET,
  });
}
