import React from "react";

type ChipProps = {
  selected: string;
  handleChangeSelection: (title: string) => void;
  tags: string[];
};

export default function ChipList(props: ChipProps) {
  const { tags, handleChangeSelection } = props;
  return (
    <div className="grid grid-cols-3 gap-2 bg-background rounded-3xl">
      {tags.map((tag, index) => (
        <div
          onClick={() => handleChangeSelection(tag)}
          key={index}
          className={"px-1 md:px-3 py-2 text-center cursor-pointer rounded"}
          style={{
            backgroundColor: tag === props.selected ? "white" : "inherit",
          }}
        >
          <p
            style={{
              color: tag !== props.selected ? "white" : "black",
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
}
