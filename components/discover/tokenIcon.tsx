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

  const tokenIconMap: { [key: string]: string } = {
    USDC: "/icons/usdc.svg",
    ETH: "/icons/eth.svg",
    LORDS: "/icons/lords.webp",
    SITH: "/icons/sith.png",
    STRK: "/icons/strk.webp",
  };

  const getTokenIcon = useCallback((tokenName: string) => {
    return tokenIconMap[tokenName.toUpperCase()] || "/icons/usdc.svg";
  }, []);

  const getTokenStyle = (token: string, customStyle: CSSProperties = {}) => {
    const specialStyles: Record<string, CSSProperties> = {
      STRK: { transform: "rotateY(180deg)" }, // webp is mirrored, so need to flip it to be displayed correctly.
    };
  
    return {
      ...specialStyles[token.toUpperCase()],
      ...customStyle
    };
  };

  return (
    <CDNImg
      loading="eager"
      height={imageDimensions.height}
      width={imageDimensions.width}
      src={getTokenIcon(token)}
      alt={token}
      style={getTokenStyle(token, customStyle)}
    />
  );
};

export default TokenIcon;