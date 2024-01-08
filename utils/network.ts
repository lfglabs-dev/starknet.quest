export enum NetworkType {
  TESTNET = "TESTNET",
  MAINNET = "MAINNET",
}

export const getCurrentNetwork = () => {
  return process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "TESTNET" : "MAINNET";
};
