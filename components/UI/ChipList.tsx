import React, { useState, FunctionComponent } from "react";
import styles from "@styles/components/chiplist.module.css";
import OdTab from "@components/navbar/Tab";
import { moveHrSlider, handleMouseLeave, moveSpanActive } from "@utils/navTab";

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
      <div className={`chip-box ${styles.chiplist_container}`}>
        {tags.map((tag, index) => (
          <OdTab 
            title={tag}
            names={`${
              activeTab === index ? "active" : "text-white"
            } ${styles.each_chip}`}
            setActive={(event) => {handleChangeTab(index); moveSpanActive(event, ".chip-box")}}
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
