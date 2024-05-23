import React, { FunctionComponent } from "react";
import styles from "@styles/components/chiplist.module.css";

type ChipProps = {
  selected: string;
  handleChangeSelection: (title: string) => void;
  tags: string[];
};

const ChipList: FunctionComponent<ChipProps> = ({
  selected,
  handleChangeSelection,
  tags,
}) => {
  return (
    <div className={styles.chiplist_container} id="chipCollectionTab">
      {tags.map((tag, index) => (
        <div
          onClick={() => handleChangeSelection(tag)}
          key={index}
          className={`${styles.each_chip} chipTab ${
            tag === selected ? "active" : ""
          }`}
          style={{
            marginRight: "10px",
            transition: "900ms background-color ease-in-out",
          }}
          aria-selected={tag === selected ? "true" : "false"}
        >
          <p
            style={{
              color: tag !== selected ? "white" : "black",
              fontSize: 12,
              fontWeight: 600,
              opacity: tag !== selected ? 0.8 : 1,
            }}
          >
            {tag}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChipList;
