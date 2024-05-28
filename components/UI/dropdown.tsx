import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select'; 
import { styled } from '@mui/system';

// Define the props for the Dropdown component
type DropdownProps = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  label?: string;
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
  backgroundColor: backgroundColor || 'transparent',
  color: textColor || 'inherit',
  borderRadius: 5,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: borderColor || 'inherit',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: borderColor ? borderColor : 'inherit',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: borderColor ? borderColor : 'inherit',
  },
  '& .MuiInputLabel-root': {
    color: textColor || 'inherit',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: textColor || 'inherit',
  },
  '& .MuiSelect-select': {
    color: textColor || 'inherit',
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
              label={'label'} options={[]}>
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