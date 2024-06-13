import React, { useState, FunctionComponent } from "react";
import styles from "@styles/components/chiplist.module.css";
import { moveHrSlider, handleMouseLeave, moveSpanActive } from "@utils/navTab";

type ChipProps = {
  tags: string[];
};

const ChipList: FunctionComponent<ChipProps> = ({ tags }) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleChangeTab = (val: number) => {
    setActiveTab(val);
  };
  return (
    <div className="pb-1 chip-tab-wrapper" id="chipTabWrapper">
      <div className={`chip-box ${styles.chiplist_container}`}>
        {tags.map((tag, index) => (
          <div
            className={`${activeTab === index ? "active" : "text-white"} ${
              styles.each_chip
            } nav-tab z-50`}
            onClick={(event) => {
              handleChangeTab(index);
              moveSpanActive(event, ".chip-box");
            }}
            onMouseEnter={(event) => moveHrSlider(event, ".chip-box")}
            onMouseLeave={(event) => handleMouseLeave(event, ".chip-box")}
            key={index}
          >
            <p style={{ fontSize: 12 }}>{tag}</p>
          </div>
        ))}
        <span></span>
        <hr />
      </div>
    </div>
  );
};

export default ChipList;
