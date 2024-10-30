import React, { FunctionComponent } from "react";

const EyeIcon: FunctionComponent<IconProps> = ({ width, color }) => {
  return (
    <svg
      width={width}
      height={width}
      cursor="pointer"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z"
        fill={color}
      />
      <path
        d="M12 16.5C14.21 16.5 16 14.71 16 12.5C16 10.29 14.21 8.5 12 8.5C9.79 8.5 8 10.29 8 12.5C8 14.71 9.79 16.5 12 16.5Z"
        fill={color}
      />
      <path
        d="M12 10.5C13.38 10.5 14.5 11.62 14.5 13C14.5 14.38 13.38 15.5 12 15.5C10.62 15.5 9.5 14.38 9.5 13C9.5 11.62 10.62 10.5 12 10.5Z"
        fill="black"
      />
    </svg>
  );
};

export default EyeIcon;