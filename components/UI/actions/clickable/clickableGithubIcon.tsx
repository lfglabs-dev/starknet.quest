import { Tooltip } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
import GithubIcon from "@components/UI/iconsComponents/icons/githubIcon";
import styles from "@styles/components/icons.module.css";
import { minifyDomain } from "@utils/stringService";
import VerifiedIcon from "@components/UI/iconsComponents/icons/verifiedIcon";
import theme from "@styles/theme";

type ClickableGithubIconProps = {
  width: string;
  githubId?: string;
  domain?: string;
};

const ClickableGithubIcon: FunctionComponent<ClickableGithubIconProps> = ({
  width,
  githubId,
  domain,
}) => {
  const [githubUsername, setGithubUsername] = useState<string | undefined>();

  useEffect(() => {
    if (githubId) {
      fetch(`https://api.github.com/user/${githubId}`)
        .then((response) => response.json())
        // TO DO : Find how to import the github response type
        .then((data) => {
          setGithubUsername(data.login);
        });
    }
  }, [githubId]);

  return githubUsername ? (
    <Tooltip title={`Check ${minifyDomain(domain ?? "")} github`} arrow>
      <div
        className={styles.clickableIconGithub}
        onClick={() => window.open(`https://github.com/${githubUsername}`)}
      >
        <div className={styles.verifiedIcon}>
          <VerifiedIcon width={"18"} color={theme.palette.primary.main} />
        </div>
        <GithubIcon width={width} color="#101012" />
      </div>
    </Tooltip>
  ) : null;
};

export default ClickableGithubIcon;
