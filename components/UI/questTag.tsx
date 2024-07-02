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
  const avatarContent =
    typeof icon === "string" ? (
      <Avatar
        alt={label}
        src={icon}
        sx={{ border: "none", backgroundColor: backgroundColor || "#29282B" }}
      />
    ) : (
      <Avatar
        alt={label}
        sx={{ border: "none", backgroundColor: backgroundColor || "#29282B" }}
      >
        {icon}
      </Avatar>
    );

  return (
    <Chip
      sx={{
        backgroundColor: backgroundColor || defaultBackgroundColor,
        ...(borderColor && {
          borderColor: borderColor,
          borderWidth: 0,
          borderStyle: "solid",
        }),
        fontWeight: "normal",
        color: textColor || defaultTextColor,
        width: "auto",
        minWidth: "7rem",
        fontSize: "16px",
        height: "36px",
        flexDirection:
          label === "Done" || label === "Expired" ? "row-reverse" : "row", // Adjust direction based on label
        paddingRight: label === "Done" || label === "Expired" ? "15px" : "0", // Adjust padding for label
        fontFamily: "Sora", // Apply the correct font
        marginBottom: "16px",
      }}
      avatar={avatarContent}
      label={label}
    />
  );
};

export default QuestTag;
