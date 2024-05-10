import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "@styles/leaderboard.module.css";
import { minifyAddress } from "@utils/stringService";
import Avatar from "@components/UI/avatar";
import { decimalToHex } from "@utils/feltService";
import { getDomainFromAddress } from "../../utils/domainService";
import Divider from "@mui/material/Divider";
import { CDNImage } from "@components/cdn/image";
import Rank1Icon from "@components/UI/iconsComponents/icons/rank1Icon";
import Rank2Icon from "@components/UI/iconsComponents/icons/Rank2Icon";
import Rank3Icon from "@components/UI/iconsComponents/icons/Rank3Icon";

type RankCardProps = {
  name: string;
  experience: number;
  trophy: number;
  position: number;
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
    <div className={`${styles.rank_card_container} modified-cursor-pointer`}>
      <div className={styles.rank_card_badge}>
        {position === 1 ? (
          <Rank1Icon width="40" />
        ) : position === 2 ? (
          <Rank2Icon width="40" />
        ) : (
          <Rank3Icon width="40" />
        )}
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
          <CDNImage
            src={"/icons/xpBadge.svg"}
            priority
            width={30}
            height={30}
            alt="xp badge"
          />
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
