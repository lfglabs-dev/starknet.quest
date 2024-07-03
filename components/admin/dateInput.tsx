import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type Props = {
  value: string;
  onChange: (datetime: number) => void;
  name: string;
  label: string;
};

export default function DateInput(props: Props) {
  const { value, onChange, label, name } = props;

  const [dateValue, setDateValue] = React.useState<Dayjs | null>(
    value ? dayjs.unix(Number(value) / 1000) : null
  );

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <DateTimePicker
        onChange={(newValue) => {
          setDateValue(newValue);
          if (newValue === null) return;
          onChange(newValue.unix());
        }}
        timezone="UTC"
        format="DD/MM/YYYY HH:mm"
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
          ".MuiSvgIcon-root": {
            color: "#f4faff4d",
          },
        }}
        value={dateValue}
      />
    </div>
  );
}
