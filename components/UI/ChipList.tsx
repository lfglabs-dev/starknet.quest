import React, { FunctionComponent } from "react";
import styles from "@styles/components/chiplist.module.css";
import Typography from "./typography/typography";
import { TEXT_TYPE } from "@constants/typography";

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
    <div className={styles.chiplist_container}>
      {tags.map((tag, index) => (
        <div
          onClick={() => handleChangeSelection(tag)}
          key={index}
          className={styles.each_chip}
          style={{
            backgroundColor: tag === selected ? "white" : "transparent",
          }}
        >
          <Typography
            type={TEXT_TYPE.BODY_MICRO}
            style={{
              color: tag !== selected ? "white" : "black",
              fontSize: 12,
              fontWeight: 600,
              opacity: tag !== selected ? 0.8 : 1,
            }}
          >
            {tag}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default ChipList;
