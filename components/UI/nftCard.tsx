import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/profile.module.css";

const NftCard: FunctionComponent<NftCard> = ({ title, image, url }) => {
  const [imageUri, setImageUri] = useState<string>("");

  useEffect(() => {
    if (image.startsWith("ipfs://")) {
      setImageUri(
        image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
      );
    } else {
      setImageUri(image);
    }
  }, [image]);

  return (
    <div className={styles.nftCard}>
      <div className={styles.nftImg}>
        <img
          src={imageUri}
          alt={`Image of ${title}`}
          onClick={() => window.open(url, "_blank")}
          style={{ height: "200px", width: "200px" }}
        />
      </div>
      <p>{title}</p>
    </div>
  );
};

export default NftCard;
