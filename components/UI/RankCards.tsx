import React from "react";
import Divider from "./Divider";
import AchievementSilver from "../../public/icons/AchievementSilver.svg";
import Image from "next/image";

type RankCardsProps = {
  name: string;
  experience: number;
  trophy: number;
};

export default function RankCards(props: RankCardsProps) {
  const { name, experience, trophy } = props;
  return (
    <div className="flex flex-col w-full relative gradient rounded-lg py-6 px-4 gap-4 items-center">
      <div className="absolute top-0 -translate-y-4">
        <Image src={AchievementSilver} priority />
      </div>
      <div>{name}</div>
      <Divider />
      <div className="flex justify-around gap-4">
        <div>{experience}</div>
        <div>{trophy}</div>
      </div>
    </div>
  );
}
