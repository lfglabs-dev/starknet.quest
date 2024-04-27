import React, { FunctionComponent, useEffect, useState } from "react";
import ClickableDiscordIcon from "./clickable/clickableDiscordIcon";
import ClickableGithubIcon from "./clickable/clickableGithubIcon";
import ClickableTwitterIcon from "./clickable/clickableTwitterIcon";
import { isStarkRootDomain } from "starknetid.js/packages/core/dist/utils";
import { cairo } from "starknet";

type SocialMediaActionsProps = {
  identity: Identity;
};

const SocialMediaActions: FunctionComponent<SocialMediaActionsProps> = ({
  identity,
}) => {
  const [twitter, setTwitter] = useState<string | undefined>();
  const [discord, setDiscord] = useState<string | undefined>();
  const [github, setGithub] = useState<string | undefined>();

  useEffect(() => {
    if (isStarkRootDomain(identity?.domain.domain)) {
      identity?.verifier_data?.forEach((verifier) => {
        if (cairo.felt(verifier.field) === cairo.felt("twitter")) {
          setTwitter(verifier.data);
        }
        if (cairo.felt(verifier.field) === cairo.felt("discord")) {
          setDiscord(verifier.data);
        }
        if (cairo.felt(verifier.field) === cairo.felt("github")) {
          setGithub(verifier.data);
        }
      });
    }
  }, [identity]);

  return (
    <div className="flex flex-row gap-3 w-full justify-evenly">
      <ClickableTwitterIcon
        width="16"
        domain={identity?.domain.domain}
        twitterId={twitter}
      />
      <ClickableDiscordIcon
        width="16"
        domain={identity?.domain.domain}
        discordId={discord}
      />
      <ClickableGithubIcon
        width="16"
        domain={identity?.domain.domain}
        githubId={github}
      />
    </div>
  );
};

export default SocialMediaActions;
