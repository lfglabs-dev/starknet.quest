import React, { FunctionComponent } from "react";
import { CDNImage } from "@components/cdn/image";
import { TOKEN_ADDRESS_MAP } from "@utils/constants";

type TokenSymbolProps = {
  tokenAddress: string;
};
const TokenSymbol: FunctionComponent<TokenSymbolProps> = ({ tokenAddress }) => {
  let tokenImageLink = "";
  let imageDimensions = { width: 20, height: 20 };
  const network = process.env.NEXT_PUBLIC_IS_TESTNET ? "TESTNET" : "MAINNET";
  switch (tokenAddress) {
    case TOKEN_ADDRESS_MAP[network].USDC:
      tokenImageLink = "/icons/usdc.svg";
      break;
    case TOKEN_ADDRESS_MAP[network].ETH:
      tokenImageLink = "/icons/eth.svg";
      imageDimensions = { width: 15, height: 20 };
      break;
    default:
      tokenImageLink = "/icons/usdc.svg";
      break;
  }
  return (
    <CDNImage
      src={tokenImageLink}
      priority
      width={imageDimensions.width}
      height={imageDimensions.height}
      alt="usdc icon"
    />
  );
};

export default TokenSymbol;
