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
import CopyAddress from "@components/UI/CopyAddress"; 
import ProfilIcon from "../iconsComponents/icons/profilIcon";
import Link from "next/link";
import SocialMediaActions from "../actions/socialmediaActions";
import { getTweetLink, writeToClipboard } from "@utils/browserService";
import { hexToDecimal } from "@utils/feltService";
import { calculatePercentile } from "@utils/numberService";
import { Url } from "next/dist/shared/lib/router/router";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "../typography/typography";

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
  const [userXp, setUserXp] = useState<number>();


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
            <Typography type={TEXT_TYPE.BODY_SMALL} color="secondary" className={styles.accountCreationDate}>
              {sinceDate ? `${sinceDate}` : ""}
            </Typography>
            <Typography type={TEXT_TYPE.H2} className={styles.profile_name}>{identity.domain.domain}</Typography>
            <div className={styles.address_div}>
            <CopyAddress
                  address={identity?.owner ?? ""}
                  iconSize="24"
                  className={styles.copyButton}
                  wallet={false}
                />
              <Typography type={TEXT_TYPE.BODY_SMALL} className={styles.addressText} color="secondary">
                {minifyAddress(addressOrDomain ?? identity?.owner, 8)}
              </Typography>
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
                  <Typography type={TEXT_TYPE.BODY_DEFAULT}>Share</Typography>
                </div>
              </Link>
            </div>

            <Typography type={TEXT_TYPE.BODY_SMALL} className={styles.percentileText} color="secondary">
              {userPercentile.length > 0 && userPercentile !== "NA" ? (
                <>
                  {isOwner ? "You are " : "This user is "}
                  <span className={styles.green_span}>
                    better than {userPercentile}%
                  </span>{" "}
                  of other players.
                </>
              ) : (
                <Skeleton
                  variant="text"
                  className={questStyles.featuredQuestContentLoading}
                  sx={{ fontSize: "1rem", bgcolor: "grey.800" }}
                />
              )}
            </Typography>
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
                    <Typography type={TEXT_TYPE.BODY_DEFAULT}>Share</Typography>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.right_bottom}>
            {leaderboardData && leaderboardData?.total_users > 0 ? (
              <div className={styles.right_bottom_content}>
                <CDNImage
                  src={trophyIcon}
                  priority
                  width={25}
                  height={25}
                  alt="trophy icon"
                />
                <Typography type={TEXT_TYPE.BODY_SMALL} className={styles.statsText}>
                  {leaderboardData?.position
                    ? rankFormatter(leaderboardData?.position)
                    : "NA"}
                </Typography>
              </div>
            ) : null}
            {userXp !== undefined ? (
              <div className={styles.right_bottom_content}>
                <CDNImage
                  src={xpIcon}
                  priority
                  width={30}
                  height={30}
                  alt="xp badge"
                />
                <Typography type={TEXT_TYPE.BODY_SMALL} className={styles.statsText}>{userXp ?? "0"}</Typography>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
