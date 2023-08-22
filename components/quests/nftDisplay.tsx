import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";
import NftIssuer from "./nftIssuer";

type NftDisplayProps = {
  nfts: Nft[];
  issuer: Issuer;
};

const NftDisplay: FunctionComponent<NftDisplayProps> = ({ nfts, issuer }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <NftIssuer issuer={issuer} />
      <div className="flex gap-5 flex-wrap justify-center items-center">
        {nfts.map((nft, index) => (
          <div
            key={index}
            className="flex justify-center items-center flex-col"
          >
            <img className={styles.nftStyle} src={nft.imgSrc} />
            {nft.level && nfts.length > 1 ? (
              <p className={styles.level}>Level {nft.level}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NftDisplay;
