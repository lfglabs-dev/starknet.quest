export interface NFTCounters {
  totalNFTs: number;
  braavosCounter: number;
  argentxCounter: number;
  starkFighterLevel: number;
}

export interface NFTData {
  counters: NFTCounters;
  flags: boolean[];
}

export type LandNFT = {
  contract_address: string;
  levels: { [key: string | number]: string[] };
  identifier?: string;
  nft_names: string[];
};

export type LandsNFTsType = {
  [key: string]: LandNFT;
};
