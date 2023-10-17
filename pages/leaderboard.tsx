import React from "react";
import ChipList from "../components/UI/chipList";
import Divider from "../components/UI/Divider";
import RankCards from "../components/UI/RankCards";

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

const Rankings = (props: {
  data: { name: string; experience: number; trophy: number }[];
}) => {
  const { data } = props;
  return (
    <>
      {data.map((item, index) => (
        <div
          key={index}
          className="flex w-full justify-between items-center gap-6"
        >
          <div className="flex gap-6 justify-between" style={{ flex: 0.1 }}>
            <p className="text-white" style={{ flex: 1 }}>
              {index + 1}
            </p>
            <div className="flex gap-6" style={{ flex: 1 }}>
              <p className="text-white">{item.name}</p>
            </div>
          </div>
          <div
            className="flex w-full gap-6 items-end justify-end"
            style={{ flex: 0.9 }}
          >
            <p className="text-white">Points</p>
          </div>
        </div>
      ))}
      {/* <div className="flex flex-col w-full justify-between items-center gap-6">
        <div className="flex gap-6">
          <p className="text-white">Ranking</p>
          <div className="flex gap-6">
            <p className="text-white">PFP</p>
            <p className="text-white">Name</p>
          </div>
        </div>
        <div className="flex gap-6">
          <p className="text-white">Points</p>
        </div>
      </div> */}
    </>
  );
};

export default function Leaderboard() {
  const [selected, setSelected] = React.useState("");

  const handleChangeSelection = (title: string) => {
    setSelected(title);
  };
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
        <div>
          <span>He is</span>
          <span className="text-primary font-bold sora">
            &nbsp;better than 24%&nbsp;
          </span>
          <span>of the other players</span>
        </div>
        <Divider />
        <Rankings data={data} />
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
