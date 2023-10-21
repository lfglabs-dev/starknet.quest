// NFT names & buildings id from db, a quest NFT gives one building
export enum SoloBuildings {
  "Zklend Artemis" = 64001,
  "AVNU Astronaut" = 64002,
  "JediSwap Light Saber" = 64003,
  "Starknet ID Tribe Totem" = 64004,
  "Sithswap Helmet" = 64008,
  "MySwap" = 64009,
  "Morphine" = 64010,
  "Carmine" = 64011,
  "Ekubo" = 64012,
}

// ----- Special cases -----

// Starkfighter buildings, user gets one depending on his rank
export enum StarkFighterBuildings {
  "starkfighter bronze arcade" = 64005,
  "starkfighter silver arcade" = 64006,
  "starkfighter gold arcade" = 64007,
}

// Gigrabrain building, user gets one after responding successfully to 2 quizzes
export const GigrabrainNfts = [
  "Starknet Giga Brain NFT",
  "Account Abstraction Mastery NFT",
];
export const GigabrainBuilding = 64013;
