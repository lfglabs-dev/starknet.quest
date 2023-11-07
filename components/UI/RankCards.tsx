import React, { useEffect, useState } from "react";
import Divider from "./Divider";
import AchievementSilver from "../../public/icons/achievementSilver.svg";
import Image from "next/image";
import { minifyAddress } from "../../utils/stringService";
import AchievementGold from "../../public/icons/achievementGold.svg";
import AchievementBronze from "../../public/icons/achievementBronze.svg";
import Trophy from "../../public/icons/trophy.svg";
import XpBadge from "../../public/icons/xpBadge.svg";
import Avatar from "./avatar";
import { decimalToHex } from "../../utils/feltService";
import { getDomainFromAddress } from "../../utils/domainService";

type RankCardsProps = {
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

export default function RankCards(props: RankCardsProps) {
  const { name, experience, trophy, position } = props;
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
    <div className="flex flex-col w-full relative gradient rounded-lg py-6 px-4 gap-4 items-center">
      <div className="absolute top-0 -translate-y-4">
        <Image src={iconMap[position as keyof typeof iconMap]} priority />
      </div>

      <div className="flex gap-2 justify-center items-center">
        <Avatar address={name} width="32" />
        <div>{displayName}</div>
      </div>
      <Divider />
      <div className="flex justify-around gap-6">
        <div className="flex flex-col gap-2 items-center">
          <Image src={XpBadge} priority width={30} height={30} />
          <p>{experience}</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Image src={Trophy} priority width={30} height={30} />
          <p>{trophy}</p>
        </div>
      </div>
    </div>
  );
}
