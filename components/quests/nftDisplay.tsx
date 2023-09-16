import React, { FunctionComponent } from "react";
import NftIssuer from "./nftIssuer";
import Nfts from "./nfts";

type NftDisplayProps = {
  nfts: Nft[];
  issuer: Issuer;
};

const NftDisplay: FunctionComponent<NftDisplayProps> = ({ nfts, issuer }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <NftIssuer issuer={issuer} />
      <Nfts nfts={nfts} />
    </div>
  );
};

export default NftDisplay;
