import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/system";
import { IoIosArrowDown } from "react-icons/io";

type DropdownProps = {
  backgroundColor?: string;
  padding?: string;
  fontWeight?: string;
  borderColor?: string;
  textColor?: string;
  options?: { value: string; label: string }[];
  handleChange?: (event: SelectChangeEvent) => void;
  value?: string;
  placeholder?: string;
};

const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop) =>
    prop !== "backgroundColor" &&
    prop !== "padding" &&
    prop !== "fontWeight" &&
    prop !== "borderColor" &&
    prop !== "textColor"
})<DropdownProps>(({ backgroundColor, borderColor, textColor, padding, fontWeight }) => ({
  background: backgroundColor || "transparent",
  color: textColor || "inherit",
  borderRadius: "4px",
  cursor: 'url("/icons/pointer-cursor.png"), pointer',
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    borderWidth: "0.5px",
    borderColor: "#F4FAFF30",
    display: "flex",
    flexDirection: "row-reverse",
    borderStyle: "dashed",
    gap: "8px",
    padding: padding || "0px",
    fontWeight: fontWeight || "400",
    cursor: 'url("/icons/pointer-cursor.png"), pointer',
    color: textColor || "inherit",
    "& fieldset": {
      borderColor: "transparent",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
      borderWidth: "1px",
    },
    "&.Mui-focused fieldset": {
      borderColor: borderColor || "white",
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
    borderWidth: "1px",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: borderColor || "white",
  },
  "& .MuiInputLabel-root": {
    color: textColor || "inherit",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: textColor || "inherit",
  },
  "& .MuiSelect-select": {
    color: textColor || "inherit",
    display: "flex",
    alignItems: "center",
    cursor: 'url("/icons/pointer-cursor.png"), pointer',
    fontSize: "12px",
    lineHeight: "16px",
    "&.MuiInputBase-input.MuiOutlinedInput-input": {
      padding: "0px", // removes default padding
    }
  },
  "& .MuiSelect-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: 'url("/icons/pointer-cursor.png"), pointer',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#29282b",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#29282b",
  },
  "&:hover": {
    backgroundColor: "#29282b",
  },
  cursor: 'url("/icons/pointer-cursor.png"), pointer',
}));

const StyledMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: "#101012",
      color: "#ccc",
      borderColor: "white",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "10px",
      boxShadow: "none",
      width: "fit",
    },
  },
};

const Dropdown: React.FC<DropdownProps> = ({
  backgroundColor,
  padding,
  fontWeight,
  textColor,
  options,
  handleChange,
  value,
  placeholder = "Select a value",
}) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string>(value ?? "");

  const handleMenuChange = (event: SelectChangeEvent) => {
    if (handleChange) handleChange(event);
    setSelectedValue(event.target.value as string);
  };

  useEffect(() => {
    setSelectedValue(value ?? "");
  }, [value]);

  return (
    <StyledFormControl
      variant="outlined"
      fullWidth
      backgroundColor={backgroundColor}
      padding={padding}
      fontWeight={fontWeight}
      textColor={textColor}
    >
      <Select
        labelId="dropdown-label"
        id="dropdown"
        value={value}
        onChange={handleMenuChange}
        MenuProps={StyledMenuProps}
        renderValue={() =>
          !value || value.length === 0 ? placeholder : value
        }
        displayEmpty={true}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        IconComponent={() => (
          <span style={{ cursor: 'url("/icons/pointer-cursor.png"), pointer' }}  className="rotate-90 md:rotate-0">
            <IoIosArrowDown
              style={{
                color: `${textColor}`,
                fontSize: "14px",
                strokeWidth: 20
              }} />
          </span>
  )
}
inputProps = {{
  style: {
    borderColor: "transparent",
      borderWidth: "1px",
        cursor: 'url("/icons/pointer-cursor.png"), pointer',
          },
}}
sx = {{
  cursor: 'url("/icons/pointer-cursor.png"), pointer',
    padding: "0px"
}}
      >
  { options?.map((option) => (
    <StyledMenuItem key={option.value} value={option.value}>
      {option.label}
    </StyledMenuItem>
  ))}
      </Select >
    </StyledFormControl >
  );
};

export default Dropdown;