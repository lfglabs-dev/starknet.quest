"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ProfilePhoto from "../../public/visuals/profile.webp";
import styles from "@styles/dashboard.module.css";
import { useAccount, useStarkName } from "@starknet-react/core";
import { QuestsContext } from "@context/QuestsProvider";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@hooks/useDebounce";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import Divider from "@mui/material/Divider";
import Blur from "@components/shapes/blur";
import Avatar from "@components/UI/avatar";
import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import DashboardSkeleton from "@components/skeletons/dashboardSkeleton";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import StarkIcon from "../../components/UI/iconsComponents/icons/starknetIcon";
import ClickableTwitterIcon from "@components/UI/actions/clickable/clickableTwitterIcon";
import ClickableDiscordIcon from "@components/UI/actions/clickable/clickableDiscordIcon";
import ClickableGithubIcon from "@components/UI/actions/clickable/clickableGithubIcon";
import AchievementIcon from "@components/UI/iconsComponents/icons/achievementIcon";
import { CDNImage } from "@components/cdn/image";
import ShareIcon from "@components/UI/iconsComponents/icons/shareIcon";
import QuestCard from "@components/quests/questCard";
import RhinoSrc from "public/rhino/silverRhino.webp";
import { log } from "console";
import { isHexString, minifyAddress } from "@utils/stringService";
import useCreationDate from "@hooks/useCreationDate";
import { utils } from "starknetid.js";
import { decimalToHex, hexToDecimal } from "@utils/feltService";
import ProfileCard from "@components/UI/profileCard/profileCard";
import { LeaderboardTopperParams, fetchLeaderboardToppers, getCompletedQuests } from "@services/apiService";
import { timeFrameMap } from "@utils/timeService";
import { calculatePercentile } from "@utils/numberService";
import { getDomainFromAddress } from "@utils/domainService";



type DashboardProps = {
  params: {
    addressOrDomain: string;
  };
  questData: {
    ranking: { address: string; xp: number; achievements: number }[];
  } | undefined;
};

export default function Page({ params, questData }: DashboardProps) {
  const router = useRouter();
  const [identity, setIdentity] = useState<Identity>(); // ovo treba 1
  const addressOrDomain = params.addressOrDomain; // ovo treba 2
  const sinceDate = useCreationDate(identity); // ovo treba 3
  const [achievements, setAchievements] = useState<BuildingsInfo[]>([]); // ovo treba 4
  const [initProfile, setInitProfile] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const dynamicRoute = usePathname();
  

  const { account, address, status } = useAccount();
  const { featuredQuest } = useContext(QuestsContext);

  const [duration, setDuration] = useState<string>("Last 7 Days");
  const [userPercentile, setUserPercentile] = useState<number>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [apiCallDelay, setApiCallDelay] = useState<boolean>(false);
  const searchAddress = useDebounce<string>(searchQuery, 200);
  const [currentSearchedAddress, setCurrentSearchedAddress] =
    useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [rankingdataloading, setRankingdataloading] = useState<boolean>(false);
  const [showNoresults, setShowNoresults] = useState(false);
  const [userAddress, setUserAddress] = useState<string>("");
  const isMobile = useMediaQuery("(max-width:768px)");
  const [loading, setLoading] = useState<boolean>(false);
  const { data, isLoading, isError } = useStarkName({ address });
  const [ displayData, setDisplayData] = useState<FormattedRankingProps>([]);



  useEffect(() => setNotFound(false), [dynamicRoute]);


  useEffect(() => { // ovo treba
    setInitProfile(false);
    setAchievements([]);
  }, [address, addressOrDomain]); 

  useEffect(() => { // ovo treba
    if (!address) setIsOwner(false);
  }, [address]);

  useEffect(() => { // ovo treba
    if (
      typeof addressOrDomain === "string" &&
      addressOrDomain?.toString().toLowerCase().endsWith(".stark")
    ) {
      if (
        !utils.isBraavosSubdomain(addressOrDomain) &&
        !utils.isXplorerSubdomain(addressOrDomain)
      ) {
        starknetIdNavigator
          ?.getStarknetId(addressOrDomain)
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
          ?.getAddressFromStarkName(addressOrDomain)
          .then((addr) => {
            setIdentity({
              starknet_id: "0",
              addr: addr,
              domain: addressOrDomain,
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
      typeof addressOrDomain === "string" &&
      isHexString(addressOrDomain)
    ) {
      starknetIdNavigator
        ?.getStarkName(hexToDecimal(addressOrDomain))
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
                addr: addressOrDomain,
                domain: name,
                is_owner_main: false,
              });
              setInitProfile(true);
              if (hexToDecimal(addressOrDomain) === hexToDecimal(address))
                setIsOwner(true);
            }
          } else {
            setIdentity({
              starknet_id: "0",
              addr: addressOrDomain,
              domain: minifyAddress(addressOrDomain),
              is_owner_main: false,
            });
            setIsOwner(false);
            setInitProfile(true);
          }
        })
        .catch(() => {
          setIdentity({
            starknet_id: "0",
            addr: addressOrDomain,
            domain: minifyAddress(addressOrDomain),
            is_owner_main: false,
          });
          setInitProfile(true);
          if (hexToDecimal(addressOrDomain) === hexToDecimal(address))
            setIsOwner(true);
        });
    } else {
      setNotFound(true);
    }
  }, [addressOrDomain, address]);

  const getIdentityData = async (id: string) => { // ovo treba
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/id_to_data?id=${id}`
    );
    return response.json();
  };

  const fetchLeaderboardToppersResult = useCallback( // ovo treba
    async (requestBody: LeaderboardTopperParams) => {
      const topperData = await fetchLeaderboardToppers(requestBody);
      setLeaderboardToppers(topperData);
      
    },
    []
  );

  const fetchPageData = useCallback(async ()=> { // ovo treba
    const requestBody = {
        addr:
          status === "connected"
            ? hexToDecimal(address && address?.length > 0 ? address : userAddress)
            : "",
        page_size: 10,
        shift: 0,
        duration: timeFrameMap(duration),
    };
    setRankingdataloading(true);
    await fetchLeaderboardToppersResult({
      addr: requestBody.addr,
      duration: timeFrameMap(duration),
    });
  },[fetchLeaderboardToppersResult,address,userAddress,status]);


  const [leaderboardToppers, setLeaderboardToppers] = // ovo treba
    useState<LeaderboardToppersData>({
      best_users: [],
      total_users: 0,
  });


  // calculate user percentile
  useEffect(() => {
    const res = calculatePercentile(
      leaderboardToppers?.position ?? 0,
      leaderboardToppers?.total_users ?? 0
    );
    setUserPercentile(res);
    setShowNoresults(false);
  }, [leaderboardToppers, currentSearchedAddress, duration]);

  useEffect(() => {
    if (!questData) return;
    if (!(Object.keys(questData).length > 0)) return;
    const res: FormattedRankingProps = questData?.ranking;
    const makeCall = async () => {
      const updatedDisplayData = await Promise.all(
        res?.map(async (item) => {
          // fetch completed quests and add to the display data
          const completedQuestsResponse = await getCompletedQuests(
            addressOrDomain
          );
          item.completedQuests = completedQuestsResponse?.length;

          // get the domain name from the address
          const hexAddress = decimalToHex(addressOrDomain);
          const domainName = await getDomainFromAddress(hexAddress);
          if (domainName.length > 0) {
            item.displayName = domainName;
          } else {
            item.displayName = minifyAddress(hexAddress);
          }
          return item;
        })
      );
      setDisplayData(updatedDisplayData);
    };
    makeCall();
  }, [questData, addressOrDomain]);

  

  return (
    <div className={styles.dashboard_container}>
      {loading ? (
        <div className={styles.dashboard_skeleton}>
          <DashboardSkeleton />
        </div>
      ) : (
        <>
        <div className={styles.dashboard_wrapper}>
            <div className={styles.blur1}>
              <Blur green />
            </div>
            <div className={styles.blur2}>
              <Blur green />
            </div>

            {/* Profile Card */}
            {identity ? <ProfileCard identity={identity} addressOrDomain={addressOrDomain} sinceDate={sinceDate} userPercentile={userPercentile ? userPercentile : 0} data={questData} /> : <div className={styles.dashboard_profile_card}>Fetching data...</div> }
      
        </div>

        {/* Completed Quests */}
        <div className={styles.dashboard_completed_tasks_container}>
            <div className={styles.second_header_label}>
                <h2 className={styles.second_header}>Quests Completed</h2>
            </div>
            
            <div className={styles.quests_container}>
              
                <QuestCard 
                    children={undefined}
                    imgSrc={"public/rhino/silverRhino.webp"}
                    title={"The Rhino Charge..."}
                    onClick={function (): void {
                    console.log("Quest click");
                    } }            
                >
                </QuestCard>
                <QuestCard 
                    children={undefined}
                    imgSrc={"public/rhino/silverRhino.webp"}
                    title={"The Rhino Charge..."}
                    onClick={function (): void {
                    console.log("Quest click");
                    } }            
                >
                </QuestCard>
                <QuestCard 
                    children={undefined}
                    imgSrc={"public/rhino/silverRhino.webp"}
                    title={"The Rhino Charge..."}
                    onClick={function (): void {
                    console.log("Quest click");
                    } }            
                >
                </QuestCard>
                <QuestCard 
                    children={undefined}
                    imgSrc={"public/rhino/silverRhino.webp"}
                    title={"The Rhino Charge..."}
                    onClick={function (): void {
                    console.log("Quest click");
                    } }            
                >
                </QuestCard>
                
            </div>
            
        </div>
          
        </>
      )}
    </div>
  );
}