export enum NetworkType {
  TESTNET = "TESTNET",
  MAINNET = "MAINNET",
}

export const getCurrentNetwork = (): NetworkType => {
  return process.env.NEXT_PUBLIC_IS_TESTNET === "true"
    ? NetworkType.TESTNET
    : NetworkType.MAINNET;
};
