import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from "react";
import styles from "@styles/dashboard.module.css";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import ShareIcon from "@components/UI/iconsComponents/icons/shareIcon";
import { CDNImage } from "@components/cdn/image";
import { useAccount, useBalance, useStarkProfile } from "@starknet-react/core";
import { isHexString, minifyAddress, minifyAddressFromStrings } from "@utils/stringService";
import TrophyIcon from "../iconsComponents/icons/trophyIcon";
import xpUrl from "public/icons/xpBadge.svg";
import { LeaderboardRankingParams, LeaderboardTopperParams, fetchLeaderboardRankings, fetchLeaderboardToppers, getCompletedQuests } from "@services/apiService";
import { decimalToHex, hexToDecimal } from "@utils/feltService";
import { getDomainFromAddress } from "@utils/domainService";
import useCreationDate from "@hooks/useCreationDate";
import { calculatePercentile, formatNumberThousandEqualsK } from "@utils/numberService";
import { utils } from "starknetid.js";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import ErrorScreen from "../screens/errorScreen";
import router from "next/router";
import SocialMediaActions from "../actions/socialmediaActions";
import trophyUrl from "public/icons/trophy.svg";
import starkUrl from "public/icons/starknet.svg";
import shareSrc from "public/icons/share.svg";
import SharePopup from "../menus/sharePopup";
import theme from "@styles/theme";
import DiscordIcon from "../iconsComponents/icons/discordIcon";
import GitHubIcon from "../iconsComponents/icons/githubIcon";
import TwitterIcon from "../iconsComponents/icons/twitterIcon";
import { rankOrder, rankOrderMobile } from "@constants/common";
import { Tooltip, useMediaQuery } from "@mui/material";
import { timeFrameMap } from "@utils/timeService";
import VerifiedIcon from "../iconsComponents/icons/verifiedIcon";
import ClickableTwitterIcon from "../actions/clickable/clickableTwitterIcon";
import { isStarkRootDomain } from "starknetid.js/packages/core/dist/utils";
import ClickableDiscordIcon from "../actions/clickable/clickableDiscordIcon";
import ClickableGithubIcon from "../actions/clickable/clickableGithubIcon";
import ProfilIcon from "../iconsComponents/icons/profilIcon";




const ProfileCard: FunctionComponent<ProfileCardModified> = ({
  data,
  addressOrDomain
}) => {
  
  const [copied, setCopied] = useState(false);
  const [ displayData, setDisplayData] = useState<FormattedRankingProps>([]);
  const { address } = useAccount();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [identity, setIdentity] = useState<Identity>(); 
  const sinceDate = useCreationDate(identity); 
  const {data: profileData} = useStarkProfile({ address });
  const [notFound, setNotFound] = useState(false);
  const [initProfile, setInitProfile] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [userPercentile, setUserPercentile] = useState<number>();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [duration, setDuration] = useState<string>("Last 7 Days");
  const [ranking, setRanking] = useState<RankingData>({
    first_elt_position: 0,
    ranking: [],
  });
  const [userAddress, setUserAddress] = useState<string>("");

  const { isLoading, isError, error, data: balanceData } = useBalance({
        token: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        address,
        watch: true
    })

  const [apiCallDelay, setApiCallDelay] = useState<boolean>(false);

  const [apiIdentity, setApiIdentity] = useState<Identity | undefined>();

  const [leaderboardToppers, setLeaderboardToppers] = 
    useState<LeaderboardToppersData>({
      best_users: [],
      total_users: 0,
  });

  useEffect(() => { 
    setTimeout(() => {
      setApiCallDelay(true);
    }, 1000);
    if (address === "") return;
    if (address) setUserAddress(address);
  }, [address]);

  useEffect(()=>{
    if (!apiCallDelay) return;
    fetchPageData()
  },[apiCallDelay]);

  const fetchRankingResults = useCallback(
    async (requestBody: LeaderboardRankingParams) => {
      const response = await fetchLeaderboardRankings(requestBody);         
        setRanking(response); 
    },
    []
  );

  const fetchLeaderboardToppersResult = useCallback( 
    async (requestBody: LeaderboardTopperParams) => {
      const topperData = await fetchLeaderboardToppers(requestBody);
      setLeaderboardToppers(topperData);
      
    },
    []
  );

  const fetchPageData=useCallback(async ()=> { 
    const requestBody = {
        addr:
          status === "connected"
            ? hexToDecimal(address && address?.length > 0 ? address : "")
            : "",
        page_size: 10,
        shift: 0,
        duration: timeFrameMap(duration),
    };
    await fetchLeaderboardToppersResult({
      addr: requestBody.addr,
      duration: timeFrameMap(duration),
    });
    await fetchRankingResults(requestBody);

  },[fetchRankingResults,fetchLeaderboardToppersResult,address]);


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
          if (address != undefined) {
            const completedQuestsResponse = await getCompletedQuests(address);
            item.completedQuests = completedQuestsResponse?.length;
          } else {
            const completedQuestsResponse = 0;
            item.completedQuests = 0;
          }

          // get the domain name from the address
          const hexAddress = decimalToHex(address);
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

  useEffect(() => {
    if (isStarkRootDomain(identity?.domain ?? "")) {
      const refreshData = () =>
        fetch(
          `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/domain_to_data?domain=${identity?.domain}`
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

  useEffect(() => { 
    if (
      typeof address === "string" &&
      address?.toString().toLowerCase().endsWith(".stark")
    ) {
      if (
        !utils.isBraavosSubdomain(address) &&
        !utils.isXplorerSubdomain(address)
      ) {
        starknetIdNavigator
          ?.getStarknetId(address)
          .then((id) => {
            getIdentityData(id).then((data: Identity) => {
              if (data.error) {
                setNotFound(true);
                return;
              }
              setIdentity({
                ...data,
                starknet_id: id.toString(),
              });
              if (hexToDecimal(address) === hexToDecimal(data.addr))
                setIsOwner(true);
              setInitProfile(true);
            });
          })
          .catch(() => {
            return;
          });
      } else {
        starknetIdNavigator
          ?.getAddressFromStarkName(address)
          .then((addr) => {
            setIdentity({
              starknet_id: "0",
              addr: addr,
              domain: address,
              is_owner_main: false,
            });
            setInitProfile(true);
            if (hexToDecimal(address) === hexToDecimal(addr)) setIsOwner(true);
          })
          .catch(() => {
            return;
          });
      }
    } else if (
      typeof address === "string" &&
      isHexString(address)
    ) {
        starknetIdNavigator
        ?.getStarkName(hexToDecimal(address))
        .then((name) => {
          if (name) {
            if (
              !utils.isBraavosSubdomain(name) &&
              !utils.isXplorerSubdomain(name)
            ) {
              starknetIdNavigator
                ?.getStarknetId(name)
                .then((id) => {
                  getIdentityData(id).then((data: Identity) => {
                    if (data.error) return;
                    setIdentity({
                      ...data,
                      starknet_id: id.toString(),
                    });
                    if (hexToDecimal(address) === hexToDecimal(data.addr))
                      setIsOwner(true);
                    setInitProfile(true);
                  });
                })
                .catch(() => {
                  return;
                });
            } else {
              setIdentity({
                starknet_id: "0",
                addr: address,
                domain: name,
                is_owner_main: false,
              });
              setInitProfile(true);
              if (hexToDecimal(address) === hexToDecimal(address))
                setIsOwner(true);
            }
          } else {
            setIdentity({
              starknet_id: "0",
              addr: address,
              domain: minifyAddress(address),
              is_owner_main: false,
            });
            setIsOwner(false);
            setInitProfile(true);
          }
        })
        .catch(() => {
          setIdentity({
            starknet_id: "0",
            addr: address,
            domain: minifyAddress(address),
            is_owner_main: false,
          });
          setInitProfile(true);
          if (hexToDecimal(address) === hexToDecimal(address))
            setIsOwner(true);
        });
    } else {
      setNotFound(true);
    }
  }, [address]);

  useEffect(() => {
    // calculate user percentile
    const res = calculatePercentile(
      leaderboardToppers?.position ?? 0,
      leaderboardToppers?.total_users ?? 0
    );
    setUserPercentile(res);
  }, [leaderboardToppers ]);

  


  const getIdentityData = async (id: string) => { 
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/id_to_data?id=${id}`
    );
    return response.json();
  };

  const handleChangeSelection = (title: string) => {
    setDuration(title);
  };

  if (!identity) {
      return <div>Loading profile data...</div>;
  }

  return (
    <>
    <div className={styles.dashboard_profile_card}>
      <div className={`${styles.left} ${styles.child}`}>
        <div className={styles.profile_picture_div}>
          {profileData?.profilePicture ? (
            <img
            src={profileData?.profilePicture}
            className="rounded-full"
            />
            ) : (
              <ProfilIcon width={"120"} color={theme.palette.secondary.main} />
          )}
        </div>
      </div>
      <div className={`${styles.center} ${styles.child}`}>
        <p className={styles.profile_paragraph0}>{ sinceDate? sinceDate : "" } ago</p>
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
        <p className={styles.profile_paragraph}>{typeof address === "string" && minifyAddressFromStrings([address, identity?.addr || ""],8)}
        </p>
        </div>
        <p className={styles.profile_paragraph2}>
          You are <span className={styles.green_span}>better than {userPercentile}%</span> of other players.
        </p>
      </div>
      <div className={`${styles.right} ${styles.child}`}>
        <div className={styles.right_top}>
          <div className={styles.right_socials}>
            {apiIdentity? 
             
                <>
                <ClickableTwitterIcon width={"20"} twitterId={apiIdentity?.twitter ?? apiIdentity?.old_twitter} domain={identity.domain} />
                <ClickableDiscordIcon width={"20"} discordId={apiIdentity?.discord ?? apiIdentity?.old_discord} domain={identity.domain}/>
                <ClickableGithubIcon width={"20"} githubId={apiIdentity?.github ?? apiIdentity?.old_github} domain={identity.domain}/>
                </>
              
            : <>
              <a href={""} className={styles.social_icon_wrap}>
              <TwitterIcon width={"24"}/>
              </a>
              <a href={""} className={styles.social_icon_wrap}>
                <DiscordIcon width={"24"}/>
              </a>
              <a href="" className={styles.social_icon_wrap}>
                <GitHubIcon width={"24"}/>
              </a>
              </>
              }
            
            <button className={styles.right_share_button}
                    onClick={() => setShowSharePopup(true)}
            >
              <CDNImage src={shareSrc} width={20} height={20} alt={"share-icon"}/>
              <p>Share</p>
            </button>
          </div>
          
        </div>
        <div className={styles.right_middle}></div>
        <div className={styles.right_bottom}>
          <div className={styles.right_bottom_content}>
            <CDNImage src={starkUrl} priority width={20} height={20} alt="STRK"/>
            <p className={styles.profile_paragraph}>{balanceData? balanceData?.value.toString() : 1}</p>
          </div>
          <div className={styles.right_bottom_content}>
            <CDNImage src={trophyUrl} priority width={20} height={20} alt="achievements"/>
            {leaderboardToppers
                ? isMobile
                  ? rankOrderMobile.map((position, index) => {
                      const item =
                        leaderboardToppers?.best_users?.[position - 1];
                      if (!item) return null;
                      return (
                        <p key={index} className={styles.profile_paragraph}>{formatNumberThousandEqualsK(item?.achievements)}</p>
                      );
                    })
                  : rankOrder.map((position, index) => {
                      const item =
                        leaderboardToppers?.best_users?.[position - 1];
                      if (!item) return null;
                      return (
                        <p key={index} className={styles.profile_paragraph}>{formatNumberThousandEqualsK(item?.achievements)}</p>
                      );
                    })
             : null}
          </div>
          <div className={styles.right_bottom_content}>
            <CDNImage src={xpUrl} priority width={20} height={20} alt="xp badge" />
            {leaderboardToppers
                ? isMobile
                  ? rankOrderMobile.map((position, index) => {
                      const item =
                        leaderboardToppers?.best_users?.[position - 1];
                      if (!item) return null;
                      return (
                        <p key={index} className={styles.profile_paragraph}>{item?.xp}</p>
                      );
                    })
                  : rankOrder.map((position, index) => {
                      const item =
                        leaderboardToppers?.best_users?.[position - 1];
                      if (!item) return null;
                      return (
                        <p key={index} className={styles.profile_paragraph}>{item?.xp}</p>
                      );
                    })
             : null}
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