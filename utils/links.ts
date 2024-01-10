import { getCurrentNetwork } from "./network";

export const starknetIdAppLink = `https://${
  getCurrentNetwork() === "TESTNET" ? "goerli." : ""
}app.starknet.id/`;
