import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";

type NftIssuerProps = {
  issuer: Issuer;
};

const NftIssuer: FunctionComponent<NftIssuerProps> = ({ issuer }) => {
  return (
    <div className={styles.issuer}>
      <img width={25} src={issuer.logoFavicon} />
      <p>{issuer.name}</p>
    </div>
  );
};

export default NftIssuer;
