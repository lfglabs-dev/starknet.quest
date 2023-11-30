import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";
import { CDNImg } from "../cdn/image";

type NftIssuerProps = {
  issuer: Issuer;
};

const NftIssuer: FunctionComponent<NftIssuerProps> = ({ issuer }) => {
  return (
    <div className={styles.issuer}>
      <CDNImg width={25} src={issuer.logoFavicon} />
      <p>{issuer.name}</p>
    </div>
  );
};

export default NftIssuer;
