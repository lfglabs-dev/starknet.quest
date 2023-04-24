import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";

type nft = {
  imgSrc: string;
  level?: number;
};

type NftDisplayProps = {
  nfts: nft[];
  issuer: Issuer;
};

const NftDisplay: FunctionComponent<NftDisplayProps> = ({ nfts, issuer }) => {
  return (
    <div className="flex flex-col-reverse justify-center items-center">
      <div className={styles.issuer}>
        <img width={25} src={issuer.logoFavicon} />
        <p>{issuer.name}</p>
      </div>
      <div className="flex gap-5 flex-wrap justify-center items-center">
        {nfts.map((nft, index) => (
          <div
            key={index}
            className="flex justify-center items-center flex-col"
          >
            <img className={styles.nftStyle} src={nft.imgSrc} />
            {nft.level ? (
              <p className={styles.level}>Level {nft.level}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NftDisplay;
