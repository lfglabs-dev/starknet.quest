import React, { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import TwitterIcon from '@components/UI/iconsComponents/icons/twitterIcon';
import GithubIcon from '@components/UI/iconsComponents/icons/githubIcon';
import DiscordIcon from '@components/UI/iconsComponents/icons/discordIcon';
import VerifiedIcon from '@components/UI/iconsComponents/icons/verifiedIcon';
import styles from '@styles/components/icons.module.css';
import theme from '@styles/theme';
import { minifyDomain } from '@utils/stringService';

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

  const fetchGithubUsername = async (profileId: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${profileId}`);
      const data = await response.json();
      setGithubUsername(data.login);
    } catch (error) {
      console.error('Error fetching GitHub user:', error);
    }
  };
  useEffect(() => {
    if (platform === 'github' && profileId) {
      fetchGithubUsername(profileId);
    }
  }, [platform, profileId]);

  const title = `${minifyDomain(domain ?? '')}'s ${platform} is verified`;

  const getIcon = () => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon width={width} color={"white"} />;
      case 'github':
        return <GithubIcon width={width} color="#101012" />;
      case 'discord':
        return <DiscordIcon width={width} color={"white"} />;
      default:
        return null;
    }
  };

  const getPlatformStyle = () => {
    switch (platform) {
      case 'twitter':
        return styles.clickableIconTwitter;
      case 'github':
        return styles.clickableIconGithub;
      case 'discord':
        return styles.clickableIconDiscord;
      default:
        return '';
    }
  };

  if (!profileId || (platform === 'github' && !githubUsername)) {
    return null;
  }

  return (
    <Tooltip title={title} arrow>
      <div className={getPlatformStyle()}>
        <div className={styles.verifiedIcon}>
          <VerifiedIcon width="18" color={theme.palette.primary.main} />
        </div>
        {getIcon()}
      </div>
    </Tooltip>
  );
};

export default ClickableSocialIcon;
