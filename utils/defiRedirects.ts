const linkMap: { [key: string]: { [key: string]: string } } = {
  myswap: {
    "Provide Liquidity": "https://app.myswap.xyz/#/positions",
  },
  sithswap: {
    "Provide Liquidity": "https://app.sithswap.com/all/",
  },
  starkdefi: {
    "Provide Liquidity": "https://app.starkdefi.com/#/pool",
  },
  nostra: {
    "Provide Liquidity": "https://app.nostra.finance/pools",
  },
  haiko: {
    "Provide Liquidity": "https://app.haiko.xyz/positions",
  },
  ekubo: {
    "Provide Liquidity": "https://app.ekubo.org/positions",
  },
  "10kswap": {
    "Provide Liquidity": "https://10kswap.com/pool",
  },
  nimbora: {
    Strategies: "https://app.nimbora.io/",
    Lend: "https://app.nimbora.io/",
  },
  hashstack: {
    Lend: "https://app.hashstack.finance/v1/market/",
  },
  zklend: {
    Lend: "https://app.zklend.com/markets",
  },
  zkx: {
    Derivatives: "https://app.zkx.fi/",
  },
  carmine: {
    Derivatives: "https://app.carmine.finance/trade",
  },
};

export const getRedirectLink = (appName: string, actionType: string) => {
  if (appName.toLocaleLowerCase().includes("jediswap")) {
    if (actionType === "Provide Liquidity")
      return "https://app.jediswap.xyz/#/pools";
  }
  if (!linkMap[appName.toLowerCase()]) return "";
  return linkMap[appName.toLowerCase()][actionType] || "";
};
