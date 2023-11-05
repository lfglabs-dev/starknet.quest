import React from "react";
import Divider from "./Divider";
import AchievementSilver from "../../public/icons/achievementSilver.svg";
import Image from "next/image";
import { minifyAddress } from "../../utils/stringService";
import AchievementGold from "../../public/icons/achievementGold.svg";
import AchievementBronze from "../../public/icons/achievementBronze.svg";
import Trophy from "../../public/icons/trophy.svg";
import { useDisplayName } from "../../hooks/displayName.tsx";

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

  return (
    <div className="flex flex-col w-full relative gradient rounded-lg py-6 px-4 gap-4 items-center">
      <div className="absolute top-0 -translate-y-4">
        <Image src={iconMap[position]} priority />
      </div>
      <div>{useDisplayName(name)}</div>
      <Divider />
      <div className="flex justify-around gap-4">
        <div className="flex flex-col gap-2 items-center">
          <Image src={Trophy} priority />
          <p>{experience}</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Image src={Trophy} priority />
          <p>{trophy}</p>
        </div>
      </div>
    </div>
  );
}
