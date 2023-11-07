import React, { FunctionComponent } from "react";

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
    <div className="grid grid-cols-3 gap-2 bg-background rounded-3xl max-w-[320px]">
      {tags.map((tag, index) => (
        <div
          onClick={() => handleChangeSelection(tag)}
          key={index}
          className={"px-1 md:px-3 py-2 text-center cursor-pointer rounded"}
          style={{
            backgroundColor: tag === selected ? "white" : "inherit",
          }}
        >
          <p
            style={{
              color: tag !== selected ? "white" : "black",
              fontSize: 12,
              fontWeight: 600,
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
