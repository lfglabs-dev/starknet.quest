import React, { useEffect, useState } from "react";
import ChipList from "../components/UI/chipList";
import Divider from "../components/UI/Divider";
import RankCards from "../components/UI/RankCards";
import ChevronRight from "../public/icons/ChevronRightIcon.svg";
import ChevronLeft from "../public/icons/ChevronLeftIcon.svg";
import Image from "next/image";

const data = [
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
  {
    name: "Ayushtom.stark",
    experience: 15,
    trophy: 14,
  },
];

const MAX_RANKS = 10;

const Rankings = (props: {
  data: { name: string; experience: number; trophy: number }[];
  lastIndex: number;
}) => {
  const { data, lastIndex } = props;
  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex w-full justify-between items-center py-6"
        >
          <div className="flex gap-6 justify-between" style={{ flex: 0.1 }}>
            <div className="flex flex-1 max-w-[22px]">
              <p className="text-white text-center">
                {lastIndex - MAX_RANKS + index + 1 < 10
                  ? `0${lastIndex - MAX_RANKS + index + 1}`
                  : `${lastIndex - MAX_RANKS + index + 1}`}
              </p>
            </div>
            <div className="flex flex-1 gap-6">
              <p className="text-white">{item.name}</p>
            </div>
          </div>
          <div
            className="flex w-full gap-6 items-end justify-end"
            style={{ flex: 0.9 }}
          >
            <p className="text-white">{lastIndex}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Leaderboard() {
  const [selected, setSelected] = React.useState("");
  const [lastIndex, setLastIndex] = useState(MAX_RANKS);
  const [ranks, setRanks] = useState(data.slice(0, lastIndex));
  const handleChangeSelection = (title: string) => {
    setSelected(title);
  };

  const handlePagination = (type: "more" | "less") => {
    if (
      (lastIndex === 0 && type === "less") ||
      (lastIndex >= data.length && type === "more")
    )
      return;

    if (type === "more") {
      setLastIndex(lastIndex + MAX_RANKS);
      setRanks(data.slice(lastIndex, lastIndex + MAX_RANKS));
    } else {
      setLastIndex(lastIndex - MAX_RANKS);
      setRanks(data.slice(lastIndex - MAX_RANKS, lastIndex));
    }
  };

  useEffect(() => {
    console.log({
      lastIndex,
      len: data.length,
      yay: data.slice(lastIndex, lastIndex + MAX_RANKS),
    });
  }, [lastIndex]);
  return (
    <div className="p-6 md:p-32">
      <div className="flex flex-col rounded-lg bg-gray-300 w-full gap-6 px-4 md:px-8 py-7">
        <div className="flex flex-col md:flex-row w-full justify-between items-center gap-6">
          <p className="text-white">Leaderboard</p>
          <ChipList
            selected={selected}
            handleChangeSelection={handleChangeSelection}
            tags={["Last 7 Days", "Last 30 days", "All time"]}
          />
        </div>
        <div className="flex w-full flex-wrap items-center">
          <p>He is</p>
          <span className="text-primary font-bold sora">
            &nbsp;better than 24%&nbsp;
          </span>
          <p>of the other players</p>
        </div>
        <Divider />
        <Rankings lastIndex={lastIndex} data={ranks} />
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex ">
            <p className="text-white">Rows per page {MAX_RANKS}</p>
          </div>
          <div className="flex">
            <div className="flex flex-row gap-4">
              <div
                className="cursor-pointer"
                onClick={() => handlePagination("less")}
              >
                <Image src={ChevronLeft} priority />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => handlePagination("more")}
              >
                <Image src={ChevronRight} priority />
              </div>
            </div>
          </div>
        </div>

        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RankCards name={"Ayushtom.stark"} experience={15} trophy={14} />
          <RankCards name={"Ayushtom.stark"} experience={15} trophy={14} />
          <RankCards name={"Ayushtom.stark"} experience={15} trophy={14} />
        </div>
      </div>
    </div>
  );
}
