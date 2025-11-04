import React, { FunctionComponent, useEffect, useState } from "react";
import ClickableSocialIcon from "./clickable/clickableSocialIcon";
import { cairo } from "starknet";
import { isStarkRootDomain } from "starknetid.js/dist/utils";

type SocialMediaActionsProps = {
  identity: Identity;
};

type SocialPlatform = "twitter" | "discord" | "github";

const SocialMediaActions: FunctionComponent<SocialMediaActionsProps> = ({
  identity,
}) => {
  const [socialProfiles, setSocialProfiles] = useState<{
    twitter?: string;
    discord?: string;
    github?: string;
  }>({});

  useEffect(() => {
    if (isStarkRootDomain(identity?.domain.domain)) {
      const newProfiles: {
        twitter?: string;
        discord?: string;
        github?: string;
      } = {};

      identity?.verifier_data?.forEach((verifier) => {
        const field = cairo.felt(verifier.field);
        if (field === cairo.felt("twitter") && verifier.data) {
          newProfiles.twitter = verifier.data;
        } else if (field === cairo.felt("discord") && verifier.data) {
          newProfiles.discord = verifier.data;
        } else if (field === cairo.felt("github") && verifier.data) {
          newProfiles.github = verifier.data;
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
