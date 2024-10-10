import { CDNImg } from "@components/cdn/image";
import React, { CSSProperties, FunctionComponent, useCallback } from "react";

type TokenIconProps = {
  token: string;
  imageDimensions?: {
    width: number;
    height: number;
  };
  customStyle?: CSSProperties;
};

const TokenIcon: FunctionComponent<TokenIconProps> = ({
  token,
  imageDimensions = {width: 16, height: 16},
  customStyle = {}
}) => {

  const getTokenIcon = useCallback((tokenName: string) => {
    if (tokenName.toUpperCase() === "USDC") return "/icons/usdc.svg";
    if (tokenName.toUpperCase() === "ETH") return "/icons/eth.svg";
    if (tokenName.toUpperCase() === "LORDS") return "/icons/lords.webp";
    if (tokenName.toUpperCase() === "SITH") return "/icons/sith.png";
    if (tokenName.toUpperCase() === "STRK") return "/icons/strk.webp";

    return "/icons/usdc.svg";
  }, []);

  return (
    <CDNImg
      loading="eager"
      height={imageDimensions.height}
      width={imageDimensions.width}
      src={getTokenIcon(token)}
      alt={token}
      style={token.toUpperCase() === "STRK" ? { transform: "rotateY(180deg)", ...customStyle } : customStyle}
    />
  );
};

export default TokenIcon;