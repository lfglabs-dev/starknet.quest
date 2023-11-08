import React, { FunctionComponent, useEffect, useState } from "react";
import AchievementSilver from "../../public/icons/achievementSilver.svg";
import styles from "../../styles/leaderboard.module.css";
import Image from "next/image";
import { minifyAddress } from "../../utils/stringService";
import AchievementGold from "../../public/icons/achievementGold.svg";
import AchievementBronze from "../../public/icons/achievementBronze.svg";
import Trophy from "../../public/icons/trophy.svg";
import XpBadge from "../../public/icons/xpBadge.svg";
import Avatar from "../UI/avatar";
import { decimalToHex } from "../../utils/feltService";
import { getDomainFromAddress } from "../../utils/domainService";
import Divider from "@mui/material/Divider";

type RankCardProps = {
  name: string;
  experience: number;
  trophy: number;
  position: number;
};

const iconMap = {
  1: AchievementGold,
  2: AchievementSilver,
  3: AchievementBronze,
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
        <Image src={iconMap[position as keyof typeof iconMap]} priority />
      </div>

      <div className={styles.rank_card_naming}>
        <Avatar address={name} width="32" />
        <div>{minifyAddress(name)}</div>
      </div>

      <Divider
        orientation="horizontal"
        variant="fullWidth"
        sx={{
          width: "100%",
          backgroundColor: "#F4FAFF",
          opacity: 0.3,
        }}
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
