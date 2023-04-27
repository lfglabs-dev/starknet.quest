import React, { FunctionComponent } from "react";
import ClickableDiscordIcon from "./clickable/clickableDiscordIcon";
import ClickableGithubIcon from "./clickable/clickableGithubIcon";
import ClickableTwitterIcon from "./clickable/clickableTwitterIcon";

const SocialMediaActions: FunctionComponent<SocialMediaActions> = ({
  tokenId,
  isOwner,
  domain = "",
}) => {
  return (
    <div className="flex flex-row gap-1">
      <div className="m-1">
        <ClickableTwitterIcon
          isOwner={isOwner}
          width="25"
          tokenId={tokenId}
          domain={domain}
        />
      </div>
      <div className="m-1">
        <ClickableDiscordIcon
          isOwner={isOwner}
          width="25"
          tokenId={tokenId}
          domain={domain}
        />
      </div>
      <div className="m-1">
        <ClickableGithubIcon
          isOwner={isOwner}
          width="25"
          tokenId={tokenId}
          domain={domain}
        />
      </div>
    </div>
  );
};

export default SocialMediaActions;
