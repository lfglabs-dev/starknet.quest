import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "@styles/dashboard.module.css";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import ShareIcon from "@components/UI/iconsComponents/icons/shareIcon";
import StarkIcon from "@components/UI/iconsComponents/icons/starknetIcon";
import TwitterIcon from "../iconsComponents/icons/twitterIcon";
import DiscordIcon from "../iconsComponents/icons/discordIcon";
import GitHubIcon from "../iconsComponents/icons/githubIcon";
import { CDNImage } from "@components/cdn/image";
import useCreationDate from "@hooks/useCreationDate";
import { useStarkProfile } from "@starknet-react/core";
import { minifyAddress, minifyAddressFromStrings } from "@utils/stringService";
import StarknetIcon from "@components/UI/iconsComponents/icons/starknetIcon";
import TrophyIcon from "../iconsComponents/icons/trophyIcon";
import xpUrl from "public/icons/xpBadge.svg";
import { getCompletedQuests } from "@services/apiService";
import { decimalToHex } from "@utils/feltService";
import { getDomainFromAddress } from "@utils/domainService";



const ProfileCard: FunctionComponent<ProfileCardModified> = ({
  identity,
  addressOrDomain,
  sinceDate,
  userPercentile,
  data
}) => {
  const [copied, setCopied] = useState(false);
  const { data: profileData } = useStarkProfile({ address: identity?.addr });
  const [ displayData, setDisplayData] = useState<FormattedRankingProps>([]);


  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(identity?.addr as string);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  useEffect(() => {
    if (!data) return;
    if (!(Object.keys(data).length > 0)) return;
    const res: FormattedRankingProps = data?.ranking;
    const makeCall = async () => {
      await Promise.all(
        await res?.map(async (item) => {
          // fetch completed quests and add to the display data
          const completedQuestsResponse = await getCompletedQuests(
            identity.addr
          );
          item.completedQuests = completedQuestsResponse?.length;

          // get the domain name from the address
          const hexAddress = decimalToHex(identity.addr);
          const domainName = await getDomainFromAddress(hexAddress);
          if (domainName.length > 0) {
            item.displayName = domainName;
          } else {
            item.displayName = minifyAddress(hexAddress);
          }
        })
      );
      setDisplayData(res);
    };
    makeCall();
  }, [data]);


  return (
    <div className={styles.dashboard_profile_card}>
      <div className={`${styles.left} ${styles.child}`}>
        <div className={styles.profile_picture_div}>
          <img
            className={styles.profile_picture_img}
            src={profileData?.profilePicture}
            alt="starknet.id avatar"
          />
        </div>
      </div>
      <div className={`${styles.center} ${styles.child}`}>
        <p className={styles.profile_paragraph0}>Member since { sinceDate? sinceDate : "" } months ago</p>
        <h2 className={styles.profile_name}>{profileData?.name}</h2>
        <div className={styles.address_div}>
          <div onClick={() => copyToClipboard()}>
            <CopyIcon width={"20"} color="#F4FAFF" />
          </div>
        <p className={styles.profile_paragraph}>{typeof addressOrDomain === "string" && minifyAddressFromStrings([addressOrDomain, identity?.addr || ""],8)}
        </p>
        </div>
        <p className={styles.profile_paragraph2}>
          You are <span className={styles.green_span}>better than {userPercentile}%</span> of other players.
        </p>
      </div>
      <div className={`${styles.right} ${styles.child}`}>
        <div className={styles.right_top}>
          <div className={styles.right_socials}>
            <CDNImage src={identity.twitter? identity.twitter : ""} priority width={20} height={20} alt="twitter icon"/>
            <CDNImage src={identity.discord? identity.discord : ""} priority width={20} height={20} alt="discord icon"/>
            <CDNImage src={identity.github? identity.github : ""} priority width={20} height={20} alt="github icon"/>
          </div>
          <div className={styles.right_share_button}>
            <ShareIcon width="20" color="white" />
            <p className={styles.profile_paragraph}> Share </p>
          </div>
        </div>
        <div className={styles.right_middle}></div>
        <div className={styles.right_bottom}>
          <div className={styles.right_bottom_content}>
            <StarknetIcon width={"20"}/>
            <p className={styles.profile_paragraph}>1,475</p>
          </div>
          <div className={styles.right_bottom_content}>
            <TrophyIcon width={"20"}/>
            <p className={styles.profile_paragraph}>{data?.ranking[0].achievements}</p>
          </div>
          <div className={styles.right_bottom_content}>
            <CDNImage src={xpUrl} priority width={20} height={20} alt="xp badge" />
            <p className={styles.profile_paragraph}>{data?.ranking[0].xp}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;