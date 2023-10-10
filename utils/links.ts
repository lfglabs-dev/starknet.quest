export const starknetIdAppLink = `https://${
  process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "goerli." : ""
}app.starknet.id/`;
