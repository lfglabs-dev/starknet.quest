import { TOKEN_ADDRESS_MAP } from "../constants/common";
import { getCurrentNetwork } from "./network";

export const getTokenName = (token: string) => {
  const network = getCurrentNetwork();
  switch (token) {
    case TOKEN_ADDRESS_MAP[network].USDC:
      return "USDC";
    case TOKEN_ADDRESS_MAP[network].ETH:
      return "ETH";
    case TOKEN_ADDRESS_MAP[network].LORDS:
      return "LORDS";
    case TOKEN_ADDRESS_MAP[network].STRK:
      return "STRK";
    case TOKEN_ADDRESS_MAP[network].SITH:
      return "SITH";
    default:
      return "USDC";
  }
};
