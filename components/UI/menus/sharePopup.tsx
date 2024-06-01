import React, { FunctionComponent } from "react";
import Popup from "./popup";
import TwitterIcon from "@components/UI/iconsComponents/icons/twitterIcon";
import DiscordIcon from "@components/UI/iconsComponents/icons/discordIcon";
import iconsStyles from "@styles/components/icons.module.css";
import Button from "../button";
import styles from "@styles/components/popup.module.css";
import Typography from "../typography/typography";
import type { TEXT_TYPE } from "@constants/typography";

type SharePopupProps = {
  close: () => void;
  toCopy: string;
};

const SharePopup: FunctionComponent<SharePopupProps> = ({ close, toCopy }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(toCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Popup
      onClose={close}
      bottomContent={
        <div className="flex w-full gap-4 items-center">
          <input
            type="text"
            className="w-full text-black px-4 py-3 rounded-lg"
            value={toCopy}
          />
          <div className={styles.lilButton}>
            <Button onClick={handleCopy}>{copied ? "Copied" : "Copy"}</Button>
          </div>
        </div>
      }
    >
      <>
        <Typography type={TEXT_TYPE.H3} className="text-center font-bold text-3xl">Share</Typography>
        <div className="flex gap-8">
          <a
            href={`
            https://twitter.com/intent/tweet?url=Check%20out%20my%20Starknet%20Quest%20land%20at%20${toCopy}🏞️%20%23Starknet%20%23StarknetID`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-2"
          >
            <div className={iconsStyles.clickableIconTwitter}>
              <TwitterIcon width="32" color={"white"} />
            </div>
            <p>Twitter</p>
          </a>
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-2"
          >
            <div className={iconsStyles.clickableIconDiscord}>
              <DiscordIcon width="32" color={"white"} />
            </div>
            <p>Discord</p>
          </a>
        </div>
      </>
    </Popup>
  );
};

export default SharePopup;
