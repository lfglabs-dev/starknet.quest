import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "@styles/dashboard.module.css";
import { CDNImage } from "@components/cdn/image";
import { type Address } from "@starknet-react/core";
import Skeleton from "@mui/material/Skeleton";
import trophyIcon from "public/icons/trophy.svg";
import xpIcon from "public/icons/xpBadge.svg";
import useCreationDate from "@hooks/useCreationDate";
import shareSrc from "public/icons/share.svg";
import theme from "@styles/theme";
import { EyeIcon, EyeIconSlashed } from "../iconsComponents/icons/eyeIcon";
import ProfilIcon from "../iconsComponents/icons/profilIcon";
import Link from "next/link";
import SocialMediaActions from "../actions/socialmediaActions";
import { getTweetLink } from "@utils/browserService";
import { hexToDecimal } from "@utils/feltService";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "../typography/typography";
import { calculateTotalBalance } from "../../../services/argentPortfolioService";
import Avatar from "../avatar";
import { useHidePortfolio } from "@hooks/useHidePortfolio";

const MAX_RETRIES = 1000;
const RETRY_DELAY = 2000;
const controller = new AbortController();
const { signal } = controller;

type ProfileCardProps = {
  rankingData: RankingData;
  identity: Identity;
  leaderboardData: LeaderboardToppersData;
  isOwner: boolean;
};

const ProfileCard: FunctionComponent<ProfileCardProps> = ({
  rankingData,
  identity,
  leaderboardData,
  isOwner,
}) => {
  const { hidePortfolio, setHidePortfolio } = useHidePortfolio();
  const [userXp, setUserXp] = useState<number>();
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const sinceDate = useCreationDate(identity);
  const formattedAddress = (
    identity.owner.startsWith("0x") ? identity.owner : `0x${identity.owner}`
  ) as Address;

  const rankFormatter = useCallback((rank: number) => {
    if (rank > 10000) return "+10k";
    if (rank > 5000) return "+5k";
    return rank;
  }, []);

  useEffect(() => {
    const fetchTotalBalance = async () => {
      let attempts = 0;
      while (true) {
        try {
          const balance = await calculateTotalBalance(formattedAddress, "USD", { signal });
          setTotalBalance(balance);
          return; // Exit if successful
        } catch (err) {
          attempts++;
          console.error(`Attempt ${attempts} - Error fetching total balance:`, err);

          if (attempts >= MAX_RETRIES) {
            console.error("Failed to fetch total balance after multiple attempts.");
          } else {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          }
        }
      }
    };

    fetchTotalBalance();
  }, [formattedAddress]);

  const computeData = useCallback(() => {
    if (
      rankingData &&
      rankingData?.first_elt_position >= 0 &&
      identity.owner &&
      leaderboardData &&
      leaderboardData?.total_users > 0
    ) {
      const user = rankingData?.ranking?.find(
        (user) => user.address === hexToDecimal(identity.owner)
      );
      if (user) {
        setUserXp(user.xp);
      }
    }
  }, [rankingData, identity, leaderboardData]);

  useEffect(() => {
    computeData();
  }, [computeData]);

  const tweetShareLink: string = useMemo(() => {
    return `${getTweetLink(
      `Check out${isOwner ? " my " : " "}Starknet Quest Profile at ${window.location.href
      } #Starknet #StarknetID`
    )}`;
  }, [isOwner]);

  return (
    <div className={styles.dashboard_profile_card}>
      <div className={styles.left}>
        <div className={styles.profile_picture_div}>
          { formattedAddress?.length !== 0 ? ( // show the avatar of the address in the URL
            <Avatar width="120" address={formattedAddress} />
          ) : (
            <ProfilIcon width="120" color={theme.palette.secondary.main} />
          )}
        </div>

        <div className="flex flex-col h-full justify-center">
          <Typography
            type={TEXT_TYPE.BODY_SMALL}
            color="secondary"
            className={styles.accountCreationDate}
          >
            {sinceDate ? `${sinceDate}` : ""}
          </Typography>
          <Typography
            type={TEXT_TYPE.H2}
            className={`${styles.profile_name} mt-2`}
          >
            {identity.domain?.domain || "Unknown Domain"}
          </Typography>
          <div className={styles.address_div}>
            <div className="flex items-center gap-2">
              <Typography
                type={TEXT_TYPE.BODY_SMALL}
                className={`${styles.wallet_amount} font-extrabold`}
              >
                {totalBalance !== null ? (
                  hidePortfolio ? "******" : `$${totalBalance.toFixed(2)}`
                ) : (
                  <Skeleton variant="text" width={60} height={30} />
                )}
              </Typography>
              <div onClick={() => setHidePortfolio(!hidePortfolio)} className="cursor-pointer">
                {hidePortfolio ? <EyeIconSlashed /> : <EyeIcon />}
              </div>
            </div>
          </div>
          <div className="flex sm:hidden justify-center py-4">
            <SocialMediaActions identity={identity} />
            {tweetShareLink && (
              <Link href={tweetShareLink} target="_blank" rel="noreferrer">
                <div className={styles.right_share_button}>
                  <CDNImage
                    src={shareSrc}
                    width={20}
                    height={20}
                    alt="share-icon"
                  />
                  <Typography type={TEXT_TYPE.BODY_DEFAULT}>Share</Typography>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className="hidden sm:flex">
          <div className={styles.right_top}>
            <div className={styles.right_socials}>
              <SocialMediaActions identity={identity} />
              {tweetShareLink && (
                <Link href={tweetShareLink} target="_blank" rel="noreferrer">
                  <div className={styles.right_share_button}>
                    <CDNImage
                      src={shareSrc}
                      width={20}
                      height={20}
                      alt="share-icon"
                    />
                    <Typography type={TEXT_TYPE.BODY_DEFAULT}>Share</Typography>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={styles.right_bottom}>
          {leaderboardData && leaderboardData.total_users > 0 && (
            <div className={styles.right_bottom_content}>
              <CDNImage
                src={trophyIcon}
                priority
                width={25}
                height={25}
                alt="trophy icon"
              />
              <Typography
                type={TEXT_TYPE.BODY_SMALL}
                className={styles.statsText}
              >
                {leaderboardData.position
                  ? rankFormatter(leaderboardData.position)
                  : "NA"}
              </Typography>
            </div>
          )}
          {userXp !== undefined && (
            <div className={styles.right_bottom_content}>
              <CDNImage
                src={xpIcon}
                priority
                width={30}
                height={30}
                alt="xp badge"
              />
              <Typography
                type={TEXT_TYPE.BODY_SMALL}
                className={styles.statsText}
              >
                {userXp ?? "0"}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
