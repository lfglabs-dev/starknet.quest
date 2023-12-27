import { Tooltip } from "@mui/material";
import React, { FunctionComponent } from "react";
import DiscordIcon from "@components/UI/iconsComponents/icons/discordIcon";
import styles from "@styles/components/icons.module.css";
import { minifyDomain } from "@utils/stringService";
import VerifiedIcon from "@components/UI/iconsComponents/icons/verifiedIcon";
import theme from "@styles/theme";

type ClickableDiscordIconProps = {
  width: string;
  discordId?: string;
  domain?: string;
};

const ClickableDiscordIcon: FunctionComponent<ClickableDiscordIconProps> = ({
  width,
  domain,
  discordId,
}) => {
  return discordId ? (
    <Tooltip
      title={`${minifyDomain(domain ?? "")}'s discord is verified`}
      arrow
    >
      <div className={styles.clickableIconDiscord}>
        <div className={styles.verifiedIcon}>
          <VerifiedIcon width={"18"} color={theme.palette.primary.main} />
        </div>
        <DiscordIcon width={width} color={"white"} />
      </div>
    </Tooltip>
  ) : null;
};

export default ClickableDiscordIcon;
