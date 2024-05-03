import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "@styles/dashboard.module.css";
import questStyles from "@styles/quests.module.css";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import { CDNImage } from "@components/cdn/image";
import { useStarkProfile } from "@starknet-react/core";
import { minifyAddress } from "@utils/stringService";
import trophyIcon from "public/icons/trophy.svg";
import xpIcon from "public/icons/xpBadge.svg";
import useCreationDate from "@hooks/useCreationDate";
import shareSrc from "public/icons/share.svg";
import theme from "@styles/theme";
import { Skeleton, Tooltip } from "@mui/material";
import VerifiedIcon from "../iconsComponents/icons/verifiedIcon";
import ProfilIcon from "../iconsComponents/icons/profilIcon";
import Link from "next/link";
import SocialMediaActions from "../actions/socialmediaActions";
import { getTweetLink, writeToClipboard } from "@utils/browserService";
import { hexToDecimal } from "@utils/feltService";
import { calculatePercentile } from "@utils/numberService";
import { Url } from "next/dist/shared/lib/router/router";

const ProfileCard: FunctionComponent<ProfileCard> = ({
  rankingData,
  identity,
  leaderboardData,
  addressOrDomain,
  isOwner,
}) => {
  const [copied, setCopied] = useState(false);
  const sinceDate = useCreationDate(identity);
  const { data: profileData } = useStarkProfile({ address: identity.owner });
  const [userPercentile, setUserPercentile] = useState("");
  const [userXp, setUserXp] = useState<number>(0);

  const copyToClipboard = () => {
    setCopied(true);
    writeToClipboard(identity?.owner);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const rankFormatter = useCallback((rank: number) => {
    if (rank > 10000) return "+10k";
    if (rank > 5000) return "+5k";
    return rank;
  }, []);

  const computeData = useCallback(() => {
    if (
      rankingData &&
      rankingData?.first_elt_position >= 0 &&
      identity.owner &&
      leaderboardData &&
      leaderboardData?.total_users > 0
    ) {
      const user = rankingData.ranking.find(
        (user) => user.address === hexToDecimal(identity.owner)
      );
      if (user) {
        if (!leaderboardData.position) {
          setUserPercentile("NA");
          return;
        }
        const computedUserPercentile = calculatePercentile(
          leaderboardData?.position ?? 0,
          leaderboardData?.total_users ?? 0
        ).toString();
        setUserPercentile(computedUserPercentile);
        setUserXp(user.xp);
      }
    } else {
      setUserXp(-1);
    }
  }, [rankingData, identity, leaderboardData]);

  useEffect(() => {
    computeData();
  }, [rankingData, identity, leaderboardData]);

  const shareLink: Url = useMemo(() => {
    return `${getTweetLink(
      `Check out${isOwner ? " my " : " "}Starknet Quest Profile at ${
        window.location.href
      } #Starknet #StarknetID`
    )}`;
  }, []);

  return (
    <>
      <div className={styles.dashboard_profile_card}>
        <div className={styles.left}>
          <div className={styles.profile_picture_div}>
            {profileData?.profilePicture ? (
              <img src={profileData?.profilePicture} className="rounded-full" />
            ) : (
              <ProfilIcon width="120" color={theme.palette.secondary.main} />
            )}
          </div>

          <div className="flex flex-col h-full justify-between">
            <p className={styles.accountCreationDate}>
              {sinceDate ? `${sinceDate}` : ""}
            </p>
            <h2 className={styles.profile_name}>{identity.domain.domain}</h2>
            <div className={styles.address_div}>
              <div onClick={() => copyToClipboard()}>
                {!copied ? (
                  <Tooltip title="Copy" arrow>
                    <div onClick={() => copyToClipboard()}>
                      <CopyIcon width="20" color="#F4FAFF" />
                    </div>
                  </Tooltip>
                ) : (
                  <VerifiedIcon width="20" />
                )}
              </div>
              <p className={styles.addressText}>
                {minifyAddress(addressOrDomain ?? identity?.owner, 8)}
              </p>
            </div>
            <div className="flex sm:hidden justify-center py-4">
              <SocialMediaActions identity={identity} />
              <Link href={shareLink} target="_blank" rel="noreferrer">
                <div className={styles.right_share_button}>
                  <CDNImage
                    src={shareSrc}
                    width={20}
                    height={20}
                    alt={"share-icon"}
                  />
                  <p>Share</p>
                </div>
              </Link>
            </div>

            <p className={styles.percentileText}>
              {userPercentile.length > 0 && userPercentile !== "NA" ? (
                <>
                  {isOwner ? "You are " : "This user is "}
                  <span className={styles.green_span}>
                    better than {userPercentile}%
                  </span>{" "}
                  of other players.
                </>
              ) : null}
            </p>
          </div>
        </div>
        <div className={styles.right}>
          <div className="hidden sm:flex">
            <div className={styles.right_top}>
              <div className={styles.right_socials}>
                <SocialMediaActions identity={identity} />
                <Link href={shareLink} target="_blank" rel="noreferrer">
                  <div className={styles.right_share_button}>
                    <CDNImage
                      src={shareSrc}
                      width={20}
                      height={20}
                      alt={"share-icon"}
                    />
                    <p>Share</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.right_bottom}>
            {leaderboardData ? (
              <div className={styles.right_bottom_content}>
                <CDNImage
                  src={trophyIcon}
                  priority
                  width={25}
                  height={25}
                  alt="trophy icon"
                />
                <p className={styles.statsText}>
                  {leaderboardData?.position
                    ? rankFormatter(leaderboardData?.position)
                    : "NA"}
                </p>
              </div>
            ) : (
              <div className={styles.right_bottom_content}>
                <CDNImage
                  src={trophyIcon}
                  priority
                  width={25}
                  height={25}
                  alt="trophy icon"
                />
                <p className={styles.statsText}>Loading</p>
              </div>
            )}
            {userXp !== -1 ? (
              <div className={styles.right_bottom_content}>
                <CDNImage
                  src={xpIcon}
                  priority
                  width={30}
                  height={30}
                  alt="xp badge"
                />
                <p className={styles.statsText}>{userXp ?? "0"}</p>
              </div>
            ) : (
              <div className={styles.right_bottom_content}>
                <CDNImage
                  src={xpIcon}
                  priority
                  width={30}
                  height={30}
                  alt="xp badge"
                />
                <p className={styles.statsText}>NA</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
