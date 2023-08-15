import { Slider } from "@mui/material";
import React, { FunctionComponent, useState } from "react";

type ZoomSliderProps = {
  updateZoomIndex: (newValue: number) => void;
  maxValue: number;
};

const ZoomSlider: FunctionComponent<ZoomSliderProps> = ({
  updateZoomIndex,
  maxValue,
}) => {
  const minValue = 8;
  const [value, setValue] = useState<number>(minValue);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number" && newValue !== value) {
      updateZoomIndex(maxValue + minValue - newValue);
      setValue(newValue);
    }
  };

  return (
    <Slider
      value={value}
      min={minValue}
      step={1}
      max={maxValue}
      defaultValue={minValue}
      onChange={handleChange}
      aria-labelledby="non-linear-slider"
      sx={{
        color: "#E1DCEA",
        height: 2,
        width: "80%",
        maxWidth: "850px",
        margin: "auto",
        position: "absolute",
        left: "50%",
        transform: "translate(-50%, 0)",
        bottom: "40px",
      }}
    />
  );
};

export default ZoomSlider;
