// Imports
import React, { FunctionComponent } from "react";
import { Chip, Avatar } from "@mui/material";

// Tag Interface Props
type TagProps = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  label: string;
  icon: string;
};

// Tag Component
const TagComponent: FunctionComponent<TagProps> = ({
  backgroundColor,
  borderColor,
  textColor,
  label,
  icon,
}) => {
  
  // Default colors
  const defaultBackgroundColor = "#FFFFFF";
  const defaultTextColor = "#FFFFFF";

  return (
    <Chip
      sx={{
        backgroundColor: backgroundColor || defaultBackgroundColor,
        ...(borderColor && {
          borderColor: borderColor,
          borderWidth: 1,
          borderStyle: "solid",
        }),
        color: textColor || defaultTextColor,
        marginX: "0.3rem",
      }}
      avatar={<Avatar alt={label} src={icon} />}
      label={label}
    />
  );
};

export default TagComponent;