import React, { FunctionComponent } from "react";
import styles from "../../styles/profile.module.css";
import Image from "next/image";

const NftCard: FunctionComponent<NftCard> = ({ onClick, title, image }) => {
  return (
    <div className={styles.nftCard}>
      <div className={styles.nftImg}>
        <Image
          src={image}
          alt={`NFT ${title}`}
          height={200}
          width={200}
          onClick={() => onClick()}
        />
      </div>
      <p>{title}</p>
    </div>
  );
};

export default NftCard;
