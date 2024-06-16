import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/system";
import { IoIosArrowDown } from "react-icons/io";
import { getTokenName } from "@utils/tokenService";

// Define the props for the Dropdown component
type DropdownProps = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  options?: { value: string; label: string }[];
  handleChange?: (event: SelectChangeEvent) => void;
  value?: string;
  placeholder?: string;
};

// Styled component using styled-system
const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop) =>
    prop !== "backgroundColor" &&
    prop !== "borderColor" &&
    prop !== "textColor",
})<DropdownProps>(({ backgroundColor, borderColor, textColor }) => ({
  backgroundColor: backgroundColor || "transparent",
  color: textColor || "inherit",
  borderRadius: 10,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
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
  },
  "& .MuiSelect-icon": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingleft: "20px",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#66666f",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#29282b",
  },
  "&:hover": {
    backgroundColor: "#29282b",
  },
}));

const StyledMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: "#333",
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
  const [selectedValue, setSelectedValue] = React.useState<string>(
    value ?? placeholder
  );

  const handleMenuChange = (event: SelectChangeEvent) => {
    if (handleChange) handleChange(event);
    setSelectedValue(event.target.value as string);
  };

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
        IconComponent={() => (
          <IoIosArrowDown
            style={{ color: "white", fontSize: "50px", padding: "0 15px 0 0" }}
          />
        )}
        inputProps={{
          style: {
            borderColor: "transparent",
            borderWidth: "1px",
          },
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
