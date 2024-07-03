import React, { FunctionComponent } from "react";

const DownIcon: FunctionComponent<IconProps> = ({ color, width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width}
      viewBox="0 0 8 5"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.9022 0.622072L4.29297 1.0158L4.68374 0.622072C4.46792 0.404621 4.11802 0.404621 3.9022 0.622072ZM4.29297 1.80326L6.84957 4.37923C7.06538 4.59668 7.41529 4.59668 7.63111 4.37923C7.84692 4.16178 7.84692 3.80922 7.63111 3.59177L4.68374 0.622072L4.29297 1.0158L3.9022 0.622072L0.95483 3.59177C0.739014 3.80922 0.739014 4.16178 0.95483 4.37923C1.17065 4.59668 1.52055 4.59668 1.73637 4.37923L4.29297 1.80326Z"
        fill={color}
      />
    </svg>
  );
};

export default DownIcon;
