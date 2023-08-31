import React, { FunctionComponent, useEffect, useState } from "react";
import ClickableDiscordIcon from "./clickable/clickableDiscordIcon";
import ClickableGithubIcon from "./clickable/clickableGithubIcon";
import ClickableTwitterIcon from "./clickable/clickableTwitterIcon";
import { isStarkRootDomain } from "starknetid.js/packages/core/dist/utils";

type SocialMediaActionsProps = {
  identity: Identity;
};

const SocialMediaActions: FunctionComponent<SocialMediaActionsProps> = ({
  identity,
}) => {
  const [apiIdentity, setApiIdentity] = useState<Identity | undefined>();

  useEffect(() => {
    if (isStarkRootDomain(identity?.domain ?? "")) {
      const refreshData = () =>
        fetch(
          `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/domain_to_data?domain=${identity.domain}`
        )
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(await response.text());
            }
            return response.json();
          })
          .then((data: Identity) => {
            setApiIdentity(data);
          });
      refreshData();
      const timer = setInterval(() => refreshData(), 30e3);
      return () => clearInterval(timer);
    }
  }, [identity]);

  return (
    <div className="flex flex-row gap-3 w-full justify-evenly">
      <ClickableTwitterIcon
        width="16"
        domain={identity?.domain}
        twitterId={apiIdentity?.old_twitter}
      />
      <ClickableDiscordIcon
        width="16"
        domain={identity?.domain}
        discordId={apiIdentity?.old_discord}
      />
      <ClickableGithubIcon
        width="16"
        domain={identity?.domain}
        githubId={apiIdentity?.old_github}
      />
    </div>
  );
};

export default SocialMediaActions;
