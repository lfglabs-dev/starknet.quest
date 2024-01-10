import { TOKEN_ADDRESS_MAP } from "./constants";
import { getCurrentNetwork } from "./network";

export const getTokenName = (token: string) => {
  const network = getCurrentNetwork();
  switch (token) {
    case TOKEN_ADDRESS_MAP[network].USDC:
      return "USDC";
    case TOKEN_ADDRESS_MAP[network].ETH:
      return "ETH";
    default:
      return "USDC";
  }
};
