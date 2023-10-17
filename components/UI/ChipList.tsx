import classNames from "classnames";
import React from "react";

type ChipProps = {
  selected: string;
  handleChangeSelection: (title: string) => void;
  tags: string[];
};

export default function ChipList(props: ChipProps) {
  const { tags, handleChangeSelection } = props;
  return (
    <div className="grid grid-cols-3 gap-2 bg-background rounded-[10px]">
      {tags.map((tag, index) => (
        <div
          onClick={() => handleChangeSelection(tag)}
          key={index}
          className={classNames(
            "px-3 py-2 text-center cursor-pointer rounded-sm",
            {
              "bg-white rounded-3xl": tag === props.selected,
            }
          )}
        >
          <p
            className={classNames("text-xs md:text-md", {
              "text-black": tag === props.selected,
              "text-white": tag !== props.selected,
            })}
          >
            {tag}
          </p>
        </div>
      ))}
    </div>
  );
}
