import { Slider } from "@mui/material";
import React, { FunctionComponent, useState } from "react";

type ZoomSliderProps = {
  updateZoomIndex: (newValue: number) => void;
};

const ZoomSlider: FunctionComponent<ZoomSliderProps> = ({
  updateZoomIndex,
}) => {
  const [value, setValue] = useState<number>(25);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number" && newValue !== value) {
      updateZoomIndex(newValue);
      setValue(newValue);
    }
  };

  return (
    <Slider
      value={value}
      min={8}
      step={1}
      max={25}
      defaultValue={25}
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
