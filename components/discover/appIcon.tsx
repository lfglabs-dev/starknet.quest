import { CDNImg } from "@components/cdn/image";
import React, { useCallback } from "react";

const AppIcon = ({ app }: { app: string }) => {
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
        style={{
          borderRadius: "50%",
        }}
        loading="eager"
        width={25}
        src={getAppLogo(app)}
        alt={app}
      />
    </div>
  );
};

export default AppIcon;
