import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";

type NftDisplayProps = {
  imgSrc: string;
  level?: number;
  issuer: string;
};

const NftDisplay: FunctionComponent<NftDisplayProps> = ({
  imgSrc,
  level,
  issuer,
}) => {
  return (
    <div className="flex flex-col-reverse justify-center items-center">
      <div className={styles.issuer}>
        <img width={25} src="https://layer3.xyz/images/xp.png" />
        <p>{issuer}</p>
      </div>
      <div className="flex gap-5 flex-wrap justify-center items-center">
        <div className="flex justify-center items-center flex-col">
          <img className={styles.nftStyle} src={imgSrc} />
          {level ? <p className={styles.level}>Level {level}</p> : null}
        </div>
        <div className="flex justify-center items-center flex-col">
          <img className={styles.nftStyle} src={imgSrc} />
          {level ? <p className={styles.level}>Level {level}</p> : null}
        </div>
        <div className="flex justify-center items-center flex-col">
          <img className={styles.nftStyle} src={imgSrc} />
          {level ? <p className={styles.level}>Level {level}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default NftDisplay;
