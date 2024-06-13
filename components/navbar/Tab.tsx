import React from "react";

interface TabProps {
  title: string;
  names: string;
  prep: number;
  setActive: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  mouse: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  mouseLeave: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const OdTab: React.FC<TabProps> = ({
  title,
  names,
  setActive,
  prep,
  mouse,
  mouseLeave
}) => {
  return (
    <div
      className={`${names} rounded-lg z-50 nav-tab`}
      onClick={setActive}
      key={prep}
      onMouseEnter={mouse}
      onMouseLeave={mouseLeave}
    >
      {title}
    </div>
  );
};

export default OdTab;
