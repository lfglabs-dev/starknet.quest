import styled from "@emotion/styled";
import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#191527",
    borderRadius: "12px",
    color: "#E1DCEA",
    maxWidth: 206,
    padding: 12,
  },
}));
