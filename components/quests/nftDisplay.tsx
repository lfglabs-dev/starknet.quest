import React, { FunctionComponent } from "react";
import NftIssuer from "./nftIssuer";
import NftImage from "./nftImage";

type NftDisplayProps = {
  nfts: Nft[];
  issuer: Issuer;
};

const NftDisplay: FunctionComponent<NftDisplayProps> = ({ nfts, issuer }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <NftIssuer issuer={issuer} />
      <NftImage nfts={nfts} />
    </div>
  );
};

export default NftDisplay;
