import React, { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type NftIssuerProps = {
  issuer: Issuer;
};

const NftIssuer: FunctionComponent<NftIssuerProps> = ({ issuer }) => {
  return (
    <div className={styles.issuer}>
      <CDNImg width={25} src={issuer.logoFavicon} />
      <Typography type={TEXT_TYPE.BODY_DEFAULT} className="issuerText">{issuer.name}</Typography>
    </div>
  );
};

export default NftIssuer;
