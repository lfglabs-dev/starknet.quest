import React, { useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

type Props = {
  value: string;
  placeholder: string;
  onChange: (datetime: number) => void;
  name: string;
  label: string;
};

export default function DateInput(props: Props) {
  const { value, onChange, label, name } = props;

  const [dateValue, setDateValue] = React.useState<Dayjs | null>(
    value ? dayjs.unix(Number(value) / 1000) : null
  );

  useEffect(() => {
    console.log({ value, dateValue });
  }, [dateValue, value]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <DateTimePicker
        onChange={(newValue) => {
          setDateValue(newValue);
          if (!newValue) return;
          onChange(newValue.unix());
        }}
        slotProps={{
          popper: {
            sx: {
              ".MuiPaper-root": {
                backgroundColor: "#29282b",
                color: "white",
              },
              ".MuiButtonBase-root": {
                color: "#fff",
              },
              ".MuiTypography-root": {
                color: "#fff",
              },
            },
          },
        }}
        sx={{
          backgroundColor: "#29282b",
          color: "#fff",
          borderRadius: "10px",
          borderWidth: "0px",
          ":focus": {
            color: "#fff",
            borderWidth: "0px",
            outline: "none",
          },
          ".MuiInputBase-input": {
            color: "#fff",
            padding: "8px 16px",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "0px",
            },
            "&:hover fieldset": {
              borderWidth: "0px",
            },
            "&.Mui-focused fieldset": {
              borderWidth: "0px",
            },
          },
        }}
        value={dateValue}
      />
    </div>
  );
}
