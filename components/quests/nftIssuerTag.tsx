import React, { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import NftIssuer from "./nftIssuer";

type NftIssuerTagProps = {
  issuer: Issuer;
};

const NftIssuerTag: FunctionComponent<NftIssuerTagProps> = ({ issuer }) => {
  return (
    <div className={styles.issuerTag}>
      <NftIssuer issuer={issuer} />
    </div>
  );
};

export default NftIssuerTag;
