import React, { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type NftImageProps = {
  nfts: Nft[];
};

const NftImage: FunctionComponent<NftImageProps> = ({ nfts }) => {
  return (
    <div className="flex gap-5 flex-wrap justify-center items-center">
      {nfts?.map((nft, index) => (
        <div key={index} className="flex justify-center items-center flex-col">
          <CDNImg className={styles.nftStyle} src={nft.imgSrc} />
          {nft.level && nfts.length > 1 ? (
            <Typography type={TEXT_TYPE.BODY_DEFAULT} className={styles.level}>Level {nft.level}</Typography>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default NftImage;
