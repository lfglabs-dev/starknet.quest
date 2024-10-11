import { CDNImg } from "@components/cdn/image";
import React, { CSSProperties, FunctionComponent, useCallback } from "react";

type AppIconProps = {
  app: string;
  imageDimensions?: {
    width: number;
    height: number;
  };
  className?: string;
  customStyle?: CSSProperties;
};

const AppIcon: FunctionComponent<AppIconProps> = ({
  app,
  imageDimensions = {width: 25, height: 25},
  className = "",
  customStyle = {}
}) => {

  const getAppLogo = useCallback((appName: string) => {
    if (appName.toLocaleLowerCase().includes("jediswap")) {
      return "/jediswap/favicon.ico";
    }
    if (appName.toLocaleLowerCase().includes("haiko_solvers")) {
      return "/haiko/favicon.ico";
    }
    return `/${appName.toLowerCase()}/favicon.ico`;
  }, []);

  return (
    <div className="app-icon">
      <CDNImg
        className={className}
        style={{borderRadius: "50%", ...customStyle}}
        loading="eager"
        width={imageDimensions.width}
        height={imageDimensions.height}
        src={getAppLogo(app)}
        alt={app}
      />
    </div>
  );
};

export default AppIcon;
