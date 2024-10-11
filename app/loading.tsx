import React from "react";
import { Skeleton, CircularProgress } from "@mui/material";

type LoadingType = "skeleton" | "spinner";

interface LoadingWrapperProps {
  isLoading: boolean;
  loadingType?: LoadingType;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

const Loading: React.FC<LoadingWrapperProps> = ({
  isLoading,
  loadingType = "skeleton",
  children,
  width = "100%",
  height = 100,
}) => {
  if (!isLoading) return <>{children}</>;

  switch (loadingType) {
    case "skeleton":
      return (
        <Skeleton
          sx={{ bgcolor: "grey.600" }}
          variant="rectangular"
          width={width}
          height={height}
        />
      );
    case "spinner":
      return (
        <div className="flex justify-center items-center w-full h-[350px]">
          <CircularProgress />
        </div>
      );
    default:
      return null;
  }
};

export default Loading;
