import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "@styles/dashboard.module.css";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import { CDNImage } from "@components/cdn/image";
import { useStarkProfile } from "@starknet-react/core";
import { minifyAddressFromStrings } from "@utils/stringService";
import xpIcon from "public/icons/xpBadge.svg";

import useCreationDate from "@hooks/useCreationDate";
import shareSrc from "public/icons/share.svg";
import SharePopup from "../menus/sharePopup";
import theme from "@styles/theme";
import { Tooltip } from "@mui/material";
import VerifiedIcon from "../iconsComponents/icons/verifiedIcon";
import ProfilIcon from "../iconsComponents/icons/profilIcon";
import Link from "next/link";
import SocialMediaActions from "../actions/socialmediaActions";

const ProfileCard: FunctionComponent<ProfileCard> = ({
  rankingData,
  identity,
  leaderboardData,
  addressOrDomain,
  isOwner,
}) => {
  const [copied, setCopied] = useState(false);
  const sinceDate = useCreationDate(identity);
  const { data: profileData } = useStarkProfile({ address: identity.addr });
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [userPercentile, setUserPercentile] = useState("");
  const [userXp, setUserXp] = useState<number>(0);

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(identity?.addr as string);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const computeData = useCallback(() => {
    if (rankingData && identity.addr && leaderboardData) {
      const user = rankingData.ranking.find(
        (user) => user.address === identity.addr
      );
      if (user) {
        if (!leaderboardData.position) {
          setUserPercentile("NA");
          return;
        }
        const computedUserPercentile = Math.round(
          (leaderboardData.position / leaderboardData.total_users) * 100
        ).toString();
        setUserPercentile(computedUserPercentile);
        setUserXp(user.xp);
      }
    }
  }, [rankingData, identity, leaderboardData]);

  useEffect(() => {
    computeData();
  }, [rankingData, identity, leaderboardData]);

  return (
    <>
      <div className={styles.dashboard_profile_card}>
        <div className={`${styles.left} ${styles.child}`}>
          <div className={styles.profile_picture_div}>
            {profileData?.profilePicture ? (
              <img src={profileData?.profilePicture} className="rounded-full" />
            ) : (
              <ProfilIcon width={"120"} color={theme.palette.secondary.main} />
            )}
          </div>
        </div>
        <div className={`${styles.center} ${styles.child}`}>
          <p className={styles.accountCreationDate}>
            {sinceDate ? `Member since ${sinceDate}` : ""}
          </p>
          <h2 className={styles.profile_name}>{identity.domain}</h2>
          <div className={styles.address_div}>
            <div onClick={() => copyToClipboard()}>
              {!copied ? (
                <Tooltip title="Copy" arrow>
                  <div onClick={() => copyToClipboard()}>
                    <CopyIcon width={"20"} color="#F4FAFF" />
                  </div>
                </Tooltip>
              ) : (
                <VerifiedIcon width={"20"} />
              )}
            </div>
            <p className={styles.addressText}>
              {typeof addressOrDomain === "string" &&
                minifyAddressFromStrings(
                  [addressOrDomain, identity?.addr || ""],
                  8
                )}
            </p>
          </div>
          <p className={styles.percentileText}>
            {userPercentile ? (
              <>
                {isOwner ? "You are " : "User is "}
                <span className={styles.green_span}>
                  better than {userPercentile}%
                </span>{" "}
                of other players.
              </>
            ) : (
              ""
            )}
          </p>
        </div>
        <div className={`${styles.right} ${styles.child}`}>
          <div className={styles.right_top}>
            <div className={styles.right_socials}>
              <SocialMediaActions identity={identity} />
              <Link
                className={styles.right_share_button}
                href="https://twitter.com/intent/post?url=Check%20out%20my%20Starknet%20Quest%20land%20at%20http%3A%2F%2Flocalhost%3A3000%2Fdashboard%F0%9F%8F%9E%EF%B8%8F%20%23Starknet%20%23StarknetID"
                target="_blank"
                rel="noreferrer"
              >
                <CDNImage
                  src={shareSrc}
                  width={20}
                  height={20}
                  alt={"share-icon"}
                />
                <p>Share</p>
              </Link>
            </div>
          </div>
          <div className={styles.right_middle}></div>
          <div className={styles.right_bottom}>
            <div className={styles.right_bottom_content}>
              <CDNImage
                src={xpIcon}
                priority
                width={30}
                height={30}
                alt="xp badge"
              />
              <p className={styles.statsText}>{userXp ?? "Loading"}</p>
            </div>
          </div>
        </div>
      </div>
      {showSharePopup ? (
        <SharePopup
          close={() => setShowSharePopup(false)}
          toCopy={window.location.href}
        />
      ) : null}
    </>
  );
};

export default ProfileCard;
