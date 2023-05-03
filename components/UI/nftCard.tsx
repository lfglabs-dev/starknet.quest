import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/profile.module.css";

const NftCard: FunctionComponent<NftCard> = ({ title, image, url }) => {
  const [imageUri, setImageUri] = useState<string>("");

  useEffect(() => {
    if (image && image.startsWith("ipfs://")) {
      setImageUri(
        image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
      );
    } else {
      setImageUri(image);
    }
  }, [image]);

  return image ? (
    <div className={styles.nftCard}>
      <div className={styles.nftImg}>
        <img
          src={imageUri}
          alt={`Image of ${title}`}
          onClick={() => window.open(url, "_blank")}
        />
      </div>
      <p>{title}</p>
    </div>
  ) : null;
};

export default NftCard;
