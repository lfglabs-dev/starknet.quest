import { useAccount } from "@starknet-react/core";
import { useCallback } from "react";

export default function useBoost() {
  const { address } = useAccount();

  const getBoostClaimStatus = useCallback(
    (boostId: number) => {
      try {
        if (!address) return false;
        const res = localStorage.getItem("boostClaimStatus");
        if (!res) {
          return false;
        }
        const parsed = JSON.parse(res);
        return parsed[address][boostId] ?? false;
      } catch (err) {
        return false;
      }
    },
    [address]
  );

  const updateBoostClaimStatus = useCallback(
    (boostId: number, value: boolean) => {
      try {
        if (!address) return false;
        const res = localStorage.getItem("boostClaimStatus");
        const parsed = res ? JSON.parse(res) : {};
        parsed[address] = parsed[address] ?? {};
        parsed[address][boostId] = value;
        console.log(parsed);
        localStorage.setItem("boostClaimStatus", JSON.stringify(parsed));
      } catch (err) {
        console.log({ err });
        return false;
      }
    },
    [address]
  );

  return { getBoostClaimStatus, updateBoostClaimStatus };
}
