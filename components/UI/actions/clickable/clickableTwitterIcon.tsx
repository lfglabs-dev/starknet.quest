import { Tooltip } from "@mui/material";
import React, { FunctionComponent } from "react";
import TwitterIcon from "../../../UI/iconsComponents/icons/twitterIcon";
import VerifiedIcon from "../../../UI/iconsComponents/icons/verifiedIcon";
import styles from "../../../../styles/components/icons.module.css";
import theme from "../../../../styles/theme";

type ClickableTwitterIconProps = {
  width: string;
  twitterId?: string;
  domain?: string;
};

const ClickableTwitterIcon: FunctionComponent<ClickableTwitterIconProps> = ({
  width,
  twitterId,
  domain,
}) => {
  return twitterId ? (
    <Tooltip title={`${domain} twitter is verified`} arrow>
      <div className={styles.clickableIconTwitter}>
        <div className={styles.verifiedIcon}>
          <VerifiedIcon width="18" color={theme.palette.primary.main} />
        </div>
        <TwitterIcon width={width} color={"white"} />
      </div>
    </Tooltip>
  ) : null;
};

export default ClickableTwitterIcon;
