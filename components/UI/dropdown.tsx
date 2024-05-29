import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select'; 
import { styled } from '@mui/system';
import { IoIosArrowDown } from "react-icons/io";

// Define the props for the Dropdown component
type DropdownProps = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  options: { value: string; label: string }[];
};

// Styled component using styled-system
const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundColor' &&
    prop !== 'borderColor' &&
    prop !== 'textColor'
})<DropdownProps>(({ backgroundColor, borderColor, textColor }) => ({
  width: 150,
  backgroundColor: backgroundColor || 'transparent',
  color: textColor || 'inherit',
  borderRadius: 10,
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px 10px 0px 0px',
    '& fieldset': {
      borderColor: 'transparent',
      borderWidth: '1px', 
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
      borderWidth: '1px', 
    },
    '&.Mui-focused fieldset': {
      borderColor: borderColor || 'white', 
      borderWidth: '1px', 
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
    borderWidth: '1px', 
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: borderColor || 'white', 
  },
  '& .MuiInputLabel-root': {
    color: textColor || 'inherit',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: textColor || 'inherit',
  },
  '& .MuiSelect-select': {
    color: textColor || 'inherit',
    display: 'flex', 
    alignItems: 'center', 
  },
  '& .MuiSelect-icon': { 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingleft: '20px',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: 'transparent', 
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const StyledMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: '#333',
      color: '#ccc',
      borderColor: 'white',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '0px 0px 10px 10px', 
      marginTop: '-3px', 
      boxShadow: 'none', 
      width: '140px',
    },
  },
};

const Dropdown: React.FC<DropdownProps> = ({
  backgroundColor,
  textColor,
  options,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>(
    options.length > 0 ? options[0].value : ''
  );

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value as string);
  };

  return (
    <StyledFormControl
      variant="outlined"
      fullWidth
      backgroundColor={backgroundColor}
      textColor={textColor}
      options={[]}
    >
      <Select
        labelId="dropdown-label"
        id="dropdown"
        value={selectedValue}
        onChange={handleChange}
        MenuProps={StyledMenuProps}
        IconComponent={() => (
          <IoIosArrowDown style={{ color: 'white', fontSize: '50px' }} /> 
        )}
        inputProps={{
          style: {
            borderColor: 'transparent',
            borderWidth: '1px',
          },
        }}
      >
        {options.map((option) => (
          <StyledMenuItem key={option.value} value={option.value}>
            {option.label}
          </StyledMenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

export default Dropdown;
