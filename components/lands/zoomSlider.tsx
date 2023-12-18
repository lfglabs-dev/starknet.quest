import { Slider } from "@mui/material";
import React, { FunctionComponent, useMemo, useState } from "react";
import styles from "@styles/components/land.module.css";

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
  const zoomStyles = useMemo(() => {
    return {
      color: "#E1DCEA",
      height: 2,
      margin: "auto",
      position: "absolute",
      bottom: "40px",
    };
  }, []);

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
      sx={zoomStyles}
      className={styles.zoomSlider}
    />
  );
};

export default ZoomSlider;
