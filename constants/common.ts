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
  start_timestamp: null,
  expiry_timestamp: "loading",
  mandatory_domain: null,
  expired: false,
  rewards_description: null,
  additional_desc: null,
  visible: false,
  boosts: [],
};

export const basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
export const bigAlphabet = "这来";
export const totalAlphabet = basicAlphabet + bigAlphabet;
export const PAGE_SIZE = { less: 10, more: 50 };
export const TOP_50_TAB_STRING = "Top 50";

export const rankOrder = [1, 2, 3];
export const rankOrderMobile = [1, 2, 3];

export const TOKEN_ADDRESS_MAP = {
  MAINNET: {
    USDC: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    LORDS: "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
    STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    SITH: "0x06fedc8e5246e38e06c08c2e784e6a46eb2ae69433be04fe911f5726cb96b67e",
  },
  TESTNET: {
    USDC: "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426",
    ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    LORDS: "0x05e367ac160e5f90c5775089b582dfc987dd148a5a2f977c49def2a6644f724b",
    STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    SITH: "0x009630D117684520d7617Ca94b222C46110EAe1f2a76752C4088c7bFaf978B7e",
  },
};

export const TOKEN_DECIMAL_MAP = {
  USDC: 6,
  ETH: 18,
  LORDS: 18,
  STRK: 18,
  SITH: 18,
};

export const MILLISECONDS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
