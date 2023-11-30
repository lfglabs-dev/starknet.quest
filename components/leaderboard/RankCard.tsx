import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/leaderboard.module.css";
import { minifyAddress } from "../../utils/stringService";
import Avatar from "../UI/avatar";
import { decimalToHex } from "../../utils/feltService";
import { getDomainFromAddress } from "../../utils/domainService";
import Divider from "@mui/material/Divider";
import AchievementIcon from "../UI/iconsComponents/icons/achievementIcon";
import { CDNImage } from "../cdn/image";

type RankCardProps = {
  name: string;
  experience: number;
  trophy: number;
  position: number;
};

const iconMap = {
  1: "#E6CD84",
  2: "#D8D8D8",
  3: "#E2943B",
};

const RankCard: FunctionComponent<RankCardProps> = ({
  name,
  experience,
  trophy,
  position,
}) => {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const getDisplayName = async () => {
      const hexAddress = decimalToHex(name);
      const domainName = await getDomainFromAddress(hexAddress);
      if (domainName.length > 0) {
        setDisplayName(domainName);
      } else {
        setDisplayName(minifyAddress(hexAddress));
      }
    };

    getDisplayName();
  }, [name]);

  return (
    <div className={styles.rank_card_container}>
      <div className={styles.rank_card_badge}>
        <AchievementIcon
          width="32"
          color={iconMap[position as keyof typeof iconMap]}
        />
      </div>

      <div className={styles.rank_card_naming}>
        <Avatar address={name} width="32" />
        <div>{displayName}</div>
      </div>

      {/* <div style={{ width: "100%" }}> */}
      <Divider
        orientation="horizontal"
        variant="fullWidth"
        className={styles.divider}
      />
      {/* </div> */}

      <div className={styles.rank_card_numbers}>
        <div className={styles.rank_card_number_layout}>
          <CDNImage src={"/icons/xpBadge.svg"} priority width={30} height={30} alt="xp badge" />
          <p>{experience}</p>
        </div>
        <div className={styles.rank_card_number_layout}>
          <CDNImage
            src={"/icons/trophy.svg"}
            priority
            width={30}
            height={30}
            alt="trophy icon"
          />
          <p>{trophy}</p>
        </div>
      </div>
    </div>
  );
};

export default RankCard;
