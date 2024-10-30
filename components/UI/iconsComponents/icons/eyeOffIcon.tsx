import React, { FunctionComponent } from "react";

const EyeOffIcon: FunctionComponent<IconProps> = ({ width, color }) => {
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
        d="M14.12 14.12C13.8 14.46 13.39 14.75 12.92 14.92C12.55 15.08 12.15 15.15 11.75 15.11C11.35 15.08 10.96 14.95 10.61 14.72C10.26 14.5 9.96 14.18 9.73 13.8C9.5 13.4 9.37 12.96 9.34 12.5C9.32 12.1 9.39 11.7 9.55 11.33C9.71 10.96 9.95 10.62 10.27 10.34"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.94 17.94C16.26 19.36 14.13 20 12 20C7 20 2.73 16.89 1 12.5C2.06 9.93 3.92 7.86 6.29 6.51"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 5.06C10.67 4.9 11.45 4.84 12.24 4.89C16.24 5.11 20.27 8.24 22 12.5C21.33 14.03 20.38 15.41 19.21 16.53"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3L21 21"
        fill="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EyeOffIcon;