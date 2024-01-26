import React, { FunctionComponent, useEffect, useState } from "react";
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
  const [tokenImageLink, setTokenImageLink] =
    useState<string>("/icons/usdc.svg");

  useEffect(() => {
    const network = getCurrentNetwork();

    switch (tokenAddress) {
      case TOKEN_ADDRESS_MAP[network].USDC:
        setTokenImageLink("/icons/usdc.svg");
        break;
      case TOKEN_ADDRESS_MAP[network].ETH:
        setTokenImageLink("/icons/eth.svg");
        imageDimensions = { width: 15, height: 20 };
        break;
      case TOKEN_ADDRESS_MAP[network].LORDS:
        setTokenImageLink("/icons/lord.webp");
        imageDimensions = { width: 20, height: 20 };
        break;
      default:
        setTokenImageLink("/icons/usdc.svg");
        break;
    }
  }, []);

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
