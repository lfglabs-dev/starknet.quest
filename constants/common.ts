export const QuestDefault = {
  id: 0,
  name: "loading",
  desc: "loading",
  issuer: "loading",
  category: "loading",
  rewards_endpoint: "",
  logo: "",
  rewards_img: "",
  rewards_title: "loading",
  rewards_nfts: [],
  img_card: "",
  title_card: "",
  hidden: false,
  disabled: false,
  expiry_timestamp: "loading",
  mandatory_domain: null,
  expired: false,
  rewards_description: null,
  additional_desc: null,
};

export const basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
export const bigAlphabet = "这来";
export const totalAlphabet = basicAlphabet + bigAlphabet;
export const PAGE_SIZE = [10, 15, 20];

export const rankOrder = [2, 1, 3];
export const rankOrderMobile = [1, 2, 3];

export const TOKEN_ADDRESS_MAP = {
  MAINNET: {
    USDC: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    LORDS: "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
    STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  },
  TESTNET: {
    USDC: "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426",
    ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    LORDS: "0x05e367ac160e5f90c5775089b582dfc987dd148a5a2f977c49def2a6644f724b",
    STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  },
};

export const TOKEN_DECIMAL_MAP = {
  USDC: 6,
  ETH: 18,
  LORDS: 18,
  STRK: 18,
};
