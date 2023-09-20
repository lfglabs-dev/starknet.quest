import React, { FunctionComponent } from "react";

const ArrowRightIcon: FunctionComponent<IconProps> = ({
  width = 24,
  color,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width}
      viewBox="0 0 8 14"
      fill="none"
    >
      <path
        d="M7.4781 8.21816L2.95646 12.7398C2.40575 13.2905 1.77561 13.4134 1.06606 13.1085C0.356514 12.8036 0.00115935 12.2604 -7.83539e-08 11.479L-4.69848e-07 2.52263C-5.04056e-07 1.74003 0.355354 1.19628 1.06606 0.891356C1.77677 0.586435 2.4069 0.70991 2.95646 1.26178L7.4781 5.78343C7.65201 5.95734 7.78244 6.14574 7.8694 6.34863C7.95635 6.55153 7.99983 6.76891 7.99983 7.00079C7.99983 7.23267 7.95635 7.45006 7.8694 7.65295C7.78244 7.85585 7.65201 8.04425 7.4781 8.21816Z"
        fill={color}
      />
    </svg>
  );
};

export default ArrowRightIcon;
