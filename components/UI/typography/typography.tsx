import { TEXT_TYPE } from "@constants/typography";
import React, { CSSProperties, FunctionComponent } from "react";
import styles from "@styles/components/typography.module.css";

type TypographyProps = {
  type: typeof TEXT_TYPE[keyof typeof TEXT_TYPE];
  color?: string;
  className?: string;
  children: React.ReactNode;
  style?: CSSProperties;
} & React.HTMLAttributes<HTMLElement>;

/**
 * `Typography` is a component that renders text with a specific style.
 *
 * @component
 * @example
 * // Here's an example of how to use the `Typography` component:
 * 
 * import Typography, { TEXT_TYPE } from "@components/Typography";
 * 
 * function ExampleComponent() {
 *   return (
 *     <Typography type={TEXT_TYPE.H1} color="primary">
 *       This is a heading
 *     </Typography>
 *   );
 * }
 *
 * @param {object} props - The props that define the `Typography` component.
 * @param {object} props.type - The type of the text to be rendered. This should be one of the values from `TEXT_TYPE`.
 * @param {string} props.color - The color of the text. This should be a CSS variable name.
 * @param {React.ReactNode} props.children - The text to be rendered.
 * @returns {React.ReactNode} The `Typography` component.
 */
const Typography: FunctionComponent<TypographyProps> = ({ type, children, color, className, style, ...props }) => {

  const CustomTypographyComponent = type.tag || "p";
  const classes = className || styles[`typography-${type.className}`];
  const additionalStyle: CSSProperties = color ? { color: `var(--${color})`} : {};

  return (
    <CustomTypographyComponent
      className={classes}
      style={{...additionalStyle, ...style}}
      {...props}
    >
      {children}
    </CustomTypographyComponent>
  );
};

export default Typography;
