"use client";

import React, { FunctionComponent } from "react";
import styles from "@styles/components/footer.module.css";
import Link from "next/link";
import TwitterIcon from "@components/UI/iconsComponents/icons/twitterIcon";
import DiscordIcon from "@components/UI/iconsComponents/icons/discordIcon";

const Footer: FunctionComponent = () => {
  return (
    <div className="footer">
      <footer className={styles.footer}>
        <div className={styles.content}>
          <Link href="/partnership">Partnership</Link>
        </div>
        <div className={styles.socials}>
          <div
            className={styles.social}
            onClick={() => window.open("https://twitter.com/starknet_quest")}
          >
            <span>
              <TwitterIcon width="16" color="#101012" />
            </span>
            Twitter
          </div>
          <div
            className={styles.social}
            onClick={() => window.open("https://discord.gg/byEGk6w6T6")}
          >
            <span>
              <DiscordIcon width="17" color="#101012" />
            </span>
            Discord
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
