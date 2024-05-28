import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/system';

// Define the props for the Dropdown component
type DropdownProps = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  label: string;
  options: { value: string; label: string }[];
};

// Styled component using styled-system
const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundColor' &&
    prop !== 'borderColor' &&
    prop !== 'textColor'
})<DropdownProps>(({ theme, backgroundColor, borderColor, textColor }) => ({
  width: '100%',
  maxWidth: 300,
  backgroundColor: backgroundColor || '#333',
  color: textColor || '#ccc',
  borderRadius: 5,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: borderColor || '#444',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: borderColor ? borderColor : '#666',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: borderColor ? borderColor : '#666',
  },
  '& .MuiInputLabel-root': {
    color: textColor || '#ccc',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: textColor || '#ccc',
  },
  '& .MuiSelect-select': {
    color: textColor || '#fff',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#444',
  },
}));

const StyledMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: '#333',
      color: '#ccc',
    },
  },
};

const Dropdown: React.FC<DropdownProps> = ({
  backgroundColor,
  borderColor,
  textColor,
  label,
  options,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value as string);
  };
  
  return (
      <StyledFormControl
              variant="outlined"
              fullWidth
              backgroundColor={backgroundColor}
              borderColor={borderColor}
              textColor={textColor}
              label={''} options={[]}>
        <InputLabel id="dropdown-label">{label}</InputLabel>
        <Select
          labelId="dropdown-label"
          id="dropdown"
          value={selectedValue}
          label={label}
          onChange={handleChange}
          MenuProps={StyledMenuProps}
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