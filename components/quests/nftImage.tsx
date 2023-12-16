import React, { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";

type NftImageProps = {
  nfts: Nft[];
};

const NftImage: FunctionComponent<NftImageProps> = ({ nfts }) => {
  return (
    <div className="flex gap-5 flex-wrap justify-center items-center">
      {nfts.map((nft, index) => (
        <div key={index} className="flex justify-center items-center flex-col">
          <CDNImg className={styles.nftStyle} src={nft.imgSrc} />
          {nft.level && nfts.length > 1 ? (
            <p className={styles.level}>Level {nft.level}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default NftImage;
