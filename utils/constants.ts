export const basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
export const bigAlphabet = "这来";
export const totalAlphabet = basicAlphabet + bigAlphabet;
export const PAGE_SIZE = [10, 15, 20];

// used to map the time frame to the api call for leaderaboard
export const timeFrameMap = (input: string): "week" | "month" | "all" => {
  let output: "week" | "month" | "all" = "week";
  switch (input) {
    case "Last 7 Days":
      output = "week";
      break;
    case "Last 30 Days":
      output = "month";
      break;
    case "All time":
      output = "all";
      break;
    default:
      output = "week";
  }
  return output;
};

export const rankOrder = [2, 1, 3];
export const rankOrderMobile = [1, 2, 3];

export const TOKEN_ADDRESS_MAP = {
  MAINNET: {
    USDC: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
  TESTNET: {
    USDC: "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426",
    ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
};

export const TOKEN_DECIMAL_MAP = {
  USDC: 6,
  ETH: 18,
};
