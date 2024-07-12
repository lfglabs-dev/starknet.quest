import React, { FunctionComponent } from "react";

const UpIcon: FunctionComponent<IconProps> = ({ color, width }) => {
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
        d="M4.68374 4.37793L4.29297 3.9842L3.9022 4.37793C4.11802 4.59538 4.46792 4.59538 4.68374 4.37793ZM4.29297 3.19674L1.73637 0.620771C1.52055 0.403319 1.17065 0.403319 0.954831 0.620771C0.739015 0.838221 0.739015 1.19078 0.954831 1.40823L3.9022 4.37793L4.29297 3.9842L4.68374 4.37793L7.63111 1.40823C7.84692 1.19078 7.84692 0.838221 7.63111 0.620771C7.41529 0.403319 7.06538 0.403319 6.84957 0.620771L4.29297 3.19674Z"
        fill={color}
      />
    </svg>
  );
};

export default UpIcon;
