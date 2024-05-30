import React from "react";
import type { FunctionComponent } from "react";
import { Chip, Avatar } from "@mui/material";

// Tag Interface
type TagProps = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  label: string;
  icon: string | React.ReactNode;
};

// Tag Component
const QuestTag: FunctionComponent<TagProps> = ({
  backgroundColor,
  borderColor,
  textColor,
  label,
  icon,
}) => {

  // Default colors
  const defaultBackgroundColor = "#29282B";
  const defaultTextColor = "#FFFFFF";

   // Determine the avatar content based on the type of icon
   const avatarContent = typeof icon === 'string' 
   ? <Avatar alt={label} src={icon} /> 
   : <Avatar alt={label}>{icon}</Avatar>;

  return (
    <Chip
      sx={{
        backgroundColor: backgroundColor || defaultBackgroundColor,
        ...(borderColor && {
          borderColor: borderColor,
          borderWidth: 1,
          borderStyle: "solid",
        }),
        fontWeight: "normal",
        color: textColor || defaultTextColor,
        padding: "0.5rem",
        width: 'auto',
        minWidth: '7rem',
        fontSize: "16px",
        height:"36px"
      }}
      avatar={avatarContent}
      label={label}
    />
  );
};

export default QuestTag;