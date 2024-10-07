import React from 'react';
import { Tooltip } from '@mui/material';
import TwitterIcon from '@components/UI/iconsComponents/icons/twitterIcon';
import GithubIcon from '@components/UI/iconsComponents/icons/githubIcon';
import DiscordIcon from '@components/UI/iconsComponents/icons/discordIcon';
import VerifiedIcon from '@components/UI/iconsComponents/icons/verifiedIcon';
import styles from '@styles/components/icons.module.css';
import theme from '@styles/theme';

type SocialPlatform = 'twitter' | 'github' | 'discord';

interface ClickableSocialIconProps {
  platform: SocialPlatform;
  width: string;
  profileId: string;
  domain?: string;
}

const ClickableSocialIcon: React.FC<ClickableSocialIconProps> = ({
  platform,
  width,
  profileId,
  domain,
}) => {
  const title = `Check ${domain ? domain + ' ' : ''}${platform}`;

  const getIcon = () => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon width={width} color="#1DA1F2" />;
      case 'github':
        return <GithubIcon width={width} color="#101012" />;
      case 'discord':
        return <DiscordIcon width={width} color="#5865F2" />;
      default:
        return null;
    }
  };

  return profileId ? (
    <Tooltip title={title} arrow>
      <div className={styles.clickableIcon}>
        <div className={styles.verifiedIcon}>
          <VerifiedIcon width="18" color={theme.palette.primary.main} />
        </div>
        {getIcon()}
      </div>
    </Tooltip>
  ) : null;
};

export default ClickableSocialIcon;
