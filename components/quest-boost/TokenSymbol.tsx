import React, { FunctionComponent } from "react";
import { CDNImage } from "@components/cdn/image";
import { TOKEN_ADDRESS_MAP } from "@utils/constants";
import { getCurrentNetwork } from "@utils/network";

type TokenSymbolProps = {
  tokenAddress: string;
  imageDimensions?: {
    width: number;
    height: number;
  };
};
const TokenSymbol: FunctionComponent<TokenSymbolProps> = ({
  tokenAddress,
  imageDimensions = { width: 20, height: 20 },
}) => {
  let tokenImageLink = "";
  const network = getCurrentNetwork();
  switch (tokenAddress) {
    case TOKEN_ADDRESS_MAP[network].USDC:
      tokenImageLink = "/icons/usdc.svg";
      break;
    case TOKEN_ADDRESS_MAP[network].ETH:
      imageDimensions = { width: 15, height: 20 };
      tokenImageLink = "/icons/eth.svg";
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
