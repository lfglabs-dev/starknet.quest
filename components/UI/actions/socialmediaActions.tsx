import React, { FunctionComponent, useEffect, useState } from 'react';
import ClickableSocialIcon from './clickable/clickableSocialIcon';
import { isStarkRootDomain } from 'starknetid.js/packages/core/dist/utils';
import { cairo } from 'starknet';

type SocialPlatform = 'twitter' | 'discord' | 'github';

type SocialMediaActionsProps = {
  identity: Identity;
};

type SocialProfiles = {
  twitter?: string;
  discord?: string;
  github?: string;
};

const SocialMediaActions: FunctionComponent<SocialMediaActionsProps> = ({
  identity,
}) => {
  const [socialProfiles, setSocialProfiles] = useState<SocialProfiles>({
    twitter: undefined,
    discord: undefined,
    github: undefined,
  });

  useEffect(() => {
    if (isStarkRootDomain(identity?.domain.domain)) {
      const newProfiles: SocialProfiles = {};

      identity?.verifier_data?.forEach(verifier => {
        const field = cairo.felt(verifier.field) as SocialPlatform;
        if (field in newProfiles) {
          newProfiles[field] = verifier.data;
        }
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
