import React, { useEffect, useState } from 'react';
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
  const [githubUsername, setGithubUsername] = useState<string | undefined>();

  useEffect(() => {
    if (platform === 'github' && profileId) {
      fetch(`https://api.github.com/user/${profileId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setGithubUsername(data.login);
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }
  }, [platform, profileId]);

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

  const getUrl = () => {
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/${profileId}`;
      case 'github':
        return githubUsername ? `https://github.com/${githubUsername}` : "#";
      case 'discord':
        return `https://discord.com/users/${profileId}`;
      default:
        return "#";
    }
  };

  return profileId ? (
    <Tooltip title={`Check ${domain ? domain + ' ' : ''}${platform}`} arrow>
      <div className={styles.clickableIcon} onClick={() => window.open(getUrl())}>
        <div className={styles.verifiedIcon}>
          <VerifiedIcon width="18" color={theme.palette.primary.main} />
        </div>
        {getIcon()}
      </div>
    </Tooltip>
  ) : null;
};

export default ClickableSocialIcon;
