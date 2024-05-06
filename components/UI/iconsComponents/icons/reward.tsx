import React, { FunctionComponent } from "react";

const RewardIcon: FunctionComponent<IconProps> = ({ width }) => {
  return (
    <svg
      width={width}
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 21.5V19.5H11V16.4C10.1833 16.2167 9.454 15.8707 8.812 15.362C8.17 14.8533 7.69933 14.216 7.4 13.45C6.15 13.3 5.104 12.7543 4.262 11.813C3.42 10.8717 2.99933 9.76733 3 8.5V7.5C3 6.95 3.196 6.479 3.588 6.087C3.98 5.695 4.45067 5.49933 5 5.5H7V3.5H17V5.5H19C19.55 5.5 20.021 5.696 20.413 6.088C20.805 6.48 21.0007 6.95067 21 7.5V8.5C21 9.76667 20.579 10.871 19.737 11.813C18.895 12.755 17.8493 13.3007 16.6 13.45C16.3 14.2167 15.829 14.8543 15.187 15.363C14.545 15.8717 13.816 16.2173 13 16.4V19.5H17V21.5H7ZM7 11.3V7.5H5V8.5C5 9.13333 5.18333 9.70433 5.55 10.213C5.91667 10.7217 6.4 11.084 7 11.3ZM17 11.3C17.6 11.0833 18.0833 10.7207 18.45 10.212C18.8167 9.70333 19 9.13267 19 8.5V7.5H17V11.3Z"
        fill="url(#paint0_linear_4291_23589)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4291_23589"
          x1="2.97872"
          y1="12.5"
          x2="20.9787"
          y2="12.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6AFFAF" />
          <stop offset="1" stopColor="#5CE3FE" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default RewardIcon;
