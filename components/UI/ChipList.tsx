import React, { useState, FunctionComponent } from "react";
import styles from "@styles/components/chiplist.module.css";
import OdTab from "@components/navbar/Tab";
import { moveHrSlider, handleMouseLeave } from "@utils/navTab";

type ChipProps = {
  tags: string[];
};

const ChipList: FunctionComponent<ChipProps> = ({
  tags,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleChangeTab = (val: number) => {
    setActiveTab(val);
  };
  return (
    <div className="pb-1 chip-tab-wrapper" id="chipTabWrapper">
      <div className={`${styles.chiplist_container} md:h-[40px] items-center chip-box`}>
        {tags.map((tag, index) => (
          <OdTab 
            title={tag}
            names={`w-full text-center nav-item${index+1} ${
              activeTab === index ? "active" : "text-white"
            }`}
            setActive={() => handleChangeTab(index)}
            prep={0}
            mouse={(event) => moveHrSlider(event, ".chip-box")}
            mouseLeave={(event) => handleMouseLeave(event, ".chip-box")}
            key={index}
          />
        ))}
        <span></span>
        <hr />
      </div>
    </div>
  );
};

export default ChipList;
