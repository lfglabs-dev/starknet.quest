import React, { FunctionComponent } from "react";

const CloseIcon: FunctionComponent<IconProps> = ({ width = 24 }) => {
  return (
    <svg viewBox="0 0 24 24" width={width} height={width}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      ></path>
    </svg>
  );
};

export default CloseIcon;
