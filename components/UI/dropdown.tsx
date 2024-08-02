import React, { useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/system";
import { IoIosArrowDown } from "react-icons/io";

type DropdownProps = {
  backgroundColor?: string;
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
    prop !== "borderColor" &&
    prop !== "textColor",
})<DropdownProps>(({ backgroundColor, borderColor, textColor }) => ({
  backgroundColor: backgroundColor || "transparent",
  color: textColor || "inherit",
  borderRadius: 10,
  cursor: 'url("/icons/pointer-cursor.png"), pointer',
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    borderWidth: "0.5px",
    borderColor: "#f4faff4d",
    cursor: 'url("/icons/pointer-cursor.png"), pointer',
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
  },
  "& .MuiSelect-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "20px",
    cursor: 'url("/icons/pointer-cursor.png"), pointer',
  },
}));

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
      width: "140px",
    },
  },
};

const Dropdown: React.FC<DropdownProps> = ({
  backgroundColor,
  textColor,
  options,
  handleChange,
  value,
  placeholder = "Select a value",
}) => {
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
      textColor={textColor}
    >
      <Select
        labelId="dropdown-label"
        id="dropdown"
        value={selectedValue}
        onChange={handleMenuChange}
        MenuProps={StyledMenuProps}
        renderValue={() =>
          !selectedValue || selectedValue.length === 0
            ? placeholder
            : selectedValue
        }
        displayEmpty={true}
        IconComponent={() => (
          <IoIosArrowDown
            style={{ color: "white", fontSize: "50px", padding: "0 15px 0 0" }}
          />
        )}
        inputProps={{
          style: {
            borderColor: "transparent",
            borderWidth: "1px",
            cursor: 'url("/icons/pointer-cursor.png"), pointer',
          },f
        }}
        sx={{
          cursor: 'url("/icons/pointer-cursor.png"), pointer',
        }}
      >
        {options?.map((option) => (
          <StyledMenuItem key={option.value} value={option.value}>
            {option.label}
          </StyledMenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

export default Dropdown;
