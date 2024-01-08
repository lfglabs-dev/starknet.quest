import { TOKEN_ADDRESS_MAP } from "./constants";

export const getTokenName = (token: string) => {
  const network = process.env.NEXT_PUBLIC_IS_TESTNET ? "TESTNET" : "MAINNET";
  switch (token) {
    case TOKEN_ADDRESS_MAP[network].USDC:
      return "USDC";
    case TOKEN_ADDRESS_MAP[network].ETH:
      return "ETH";
    default:
      return "USDC";
  }
};
