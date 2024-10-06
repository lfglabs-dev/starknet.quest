import React, { FunctionComponent, useEffect, useState } from 'react';
import ClickableSocialIcon from './clickable/clickableSocialIcon';
import { isStarkRootDomain } from 'starknetid.js/packages/core/dist/utils';
import { cairo } from 'starknet';

type SocialPlatform = 'twitter' | 'discord' | 'github';

type SocialMediaActionsProps = {
  identity: Identity;
};

const SocialMediaActions: FunctionComponent<SocialMediaActionsProps> = ({
  identity,
}) => {
  const [socialProfiles, setSocialProfiles] = useState<{
    twitter?: string;
    discord?: string;
    github?: string;
  }>({
    twitter: undefined,
    discord: undefined,
    github: undefined,
  });

  useEffect(() => {
    if (isStarkRootDomain(identity?.domain.domain)) {
      const newProfiles: { twitter?: string; discord?: string; github?: string } = {};
      identity?.verifier_data?.forEach(verifier => {
        const field = cairo.felt(verifier.field);
        if (field === cairo.felt('twitter')) newProfiles.twitter = verifier.data;
        if (field === cairo.felt('discord')) newProfiles.discord = verifier.data;
        if (field === cairo.felt('github')) newProfiles.github = verifier.data;
      });
      setSocialProfiles(newProfiles);
    }
  }, [identity]);

  return (
    <div className="flex flex-row justify-evenly items-center gap-3">
      {Object.entries(socialProfiles).map(([platform, profileId]) => {
        const socialPlatform = platform as SocialPlatform;
        return profileId ? (
          <ClickableSocialIcon
            key={platform}
            platform={socialPlatform}
            width="16"
            profileId={profileId as string}
            domain={identity?.domain.domain}
          />
        ) : null;
      })}
    </div>
  );
};

export default SocialMediaActions;
