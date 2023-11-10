import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/leaderboard.module.css";
import Image from "next/image";
import { minifyAddress } from "../../utils/stringService";
import Trophy from "../../public/icons/trophy.svg";
import XpBadge from "../../public/icons/xpBadge.svg";
import Avatar from "../UI/avatar";
import { decimalToHex } from "../../utils/feltService";
import { getDomainFromAddress } from "../../utils/domainService";
import Divider from "@mui/material/Divider";
import AchievementIcon from "../UI/iconsComponents/icons/achievementIcon";

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

      <Divider
        orientation="horizontal"
        variant="fullWidth"
        className={styles.divider}
      />

      <div className={styles.rank_card_numbers}>
        <div className={styles.rank_card_number_layout}>
          <Image src={XpBadge} priority width={30} height={30} />
          <p>{experience}</p>
        </div>
        <div className={styles.rank_card_number_layout}>
          <Image src={Trophy} priority width={30} height={30} />
          <p>{trophy}</p>
        </div>
      </div>
    </div>
  );
};

export default RankCard;
