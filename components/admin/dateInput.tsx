import React, { useEffect } from "react";
import styles from "@styles/admin.module.css";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { Dayjs } from "dayjs";

type Props = {
  value: string;
  placeholder: string;
  onChange: (datetime: number) => void;
  name: string;
  label: string;
};

export default function DateInput(props: Props) {
  const { value, placeholder, onChange, label, name } = props;

  const [dateValue, setDateValue] = React.useState<Dayjs | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <DateTimeField
        variant="outlined"
        color="secondary"
        onChange={(newValue) => {
          setDateValue(newValue);
          if (!newValue) return;
          onChange(newValue.unix());
        }}
        sx={{
          borderColor: "#f4faff4d",
          ":focus": {
            color: "#fff",
            outline: "none",
            borderColor: "#f4faff4d",
          },
          ".MuiInputBase-input": {
            color: "#fff",
            padding: "8px 16px",
            borderColor: "#f4faff4d",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "1px",
              borderRadius: "10px",
              borderColor: "#f4faff4d",
            },
            "&:hover fieldset": {
              borderWidth: "1px",
              borderColor: "#f4faff4d",
            },
            "&.Mui-focused fieldset": {
              borderWidth: "0px",
              borderColor: "#f4faff4d",
            },
          },
        }}
        value={dateValue}
      />
    </div>
  );
}
