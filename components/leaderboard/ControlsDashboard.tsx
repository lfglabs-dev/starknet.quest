import React, { FunctionComponent, useState } from "react";
import { PAGE_SIZE } from "@constants/common";
import { Button } from "@mui/material";

const ControlsDashboard: FunctionComponent<ControlsDashboardProps> = ({
  setRowsPerPage,
  setCustomResult,
}) => {
  const [viewMore, setViewMore] = useState(true);
  return (
    <>
      <Button
        onClick={() => {
          if (viewMore) {
            setViewMore(false);
            setCustomResult(true);
            setRowsPerPage(PAGE_SIZE.more);
          } else {
            setViewMore(true);
            setCustomResult(true);
            setRowsPerPage(PAGE_SIZE.less);
          }
        }}
        variant="text"
        disableRipple
        className="w-fit text-white text self-center"
        style={{ textTransform: "none" }}
      >
        {viewMore ? "View more" : "View less"}
      </Button>
    </>
  );
};

export default ControlsDashboard;
