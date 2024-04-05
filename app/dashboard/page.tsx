"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "@styles/dashboard.module.css";
import DashboardSkeleton from "@components/skeletons/dashboardSkeleton";
import ProfileCard from "@components/UI/profileCard/profileCard";
import BoostCard from "@components/quest-boost/boostCard";
import { LeaderboardTopperParams, fetchLeaderboardToppers, getCompletedBoosts, getCompletedQuests, getQuestById } from "@services/apiService"; 
import { useAccount } from "@starknet-react/core";
import { useStarkProfile } from "@starknet-react/core";
import { calculatePercentile } from "@utils/numberService";
import QuestCard from "@components/quests/questCard";
import Blur from "@components/shapes/blur";
import { utils } from "starknetid.js";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import { hexToDecimal } from "@utils/feltService";
import { isHexString, minifyAddress } from "@utils/stringService";
import { useRouter } from "next/router";
import Quest from "@components/quests/quest";
import CompletedQuests from "@components/dashboard/completedQuests";
import { QuestsContext } from "@context/QuestsProvider";


interface RankAndTotalUsers {
  userRank: number;
  totalUsers: number;
}

type AddressOrDomainProps = {
  params: {
    addressOrDomain: string;
  };
}

export default function DashboardPage({ params }: AddressOrDomainProps) {
  const { address } = useAccount();
  const { data: profileData, isLoading, isError } = useStarkProfile({ address });
  const [userPercentile, setUserPercentile] = useState<number>();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [numOfCompletedQuests, setNumOfCompletedQuests] = useState<number>(0);
  const [initProfile, setInitProfile] = useState(false);
  const [identity, setIdentity] = useState<Identity>(); 
  const addressOrDomain = params.addressOrDomain;
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [achievements, setAchievements] = useState<BuildingsInfo[]>([]); 
  const { completedQuests } = useContext(QuestsContext);

  const fetchLeaderboardToppersResult = useCallback( 
    async (requestBody: LeaderboardTopperParams) => {
      const topperData = await fetchLeaderboardToppers(requestBody);
      setLeaderboardToppers(topperData);
      
    },
    []
  );
  
  const [leaderboardToppers, setLeaderboardToppers] = 
    useState<LeaderboardToppersData>({
      best_users: [],
      total_users: 0,
  });


  useEffect(() => { 
    setInitProfile(false);
    setAchievements([]);
  }, [address, addressOrDomain]); 

  useEffect(() => { 
    if (!address) setIsOwner(false);
  }, [address]);


  useEffect(() => {
    const fetchCompletedQuests = async () => {
      try {
        const res = await getCompletedQuests(address ? address : "");
        setNumOfCompletedQuests(res);

        const updatedQuestsResults = await Promise.allSettled(res.map((id: number) => getQuestById(id)));
        const successfulCompletedQuests = updatedQuestsResults.filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled').map(result => result.value);

        const questCards = successfulCompletedQuests;

        setQuests((prevQuests: Quest[]) => [
          ...prevQuests,
          ...questCards.filter((quest) => quest !== null),
        ]);

        
      } catch (err) {
        console.log("Error while fetching quests", err);
      }
    };

    fetchCompletedQuests();
  }, [address]);

  useEffect(() => {
    const fetchUserRankAndTotalUsers = async (): Promise<RankAndTotalUsers> => {
      const { userRank, totalUsers } = await fetchUserRankAndTotalUsers();
      const percentile = calculatePercentile(userRank, totalUsers);
      setUserPercentile(percentile);
      return {userRank, totalUsers};
    };

    if (address) {
      fetchUserRankAndTotalUsers();
    }
  }, [address]);

  useEffect(() => { 
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

  useEffect(() => {

    // calculate user percentile
    const res = calculatePercentile(
      leaderboardToppers?.position ?? 0,
      leaderboardToppers?.total_users ?? 0
    );
    setUserPercentile(res);
  }, [leaderboardToppers]);


  // DashboardSkeleton needs to be finished and isError is commented for testing
  // the completed quests part

  // if (isLoading) return <DashboardSkeleton />;
  // if (isError) return <span>Error fetching profile...</span>;

  const getIdentityData = async (id: string) => { 
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/id_to_data?id=${id}`
    );
    return response.json();
  };
  
  const completedQuestsCount = quests.length;
  const containerClass = completedQuestsCount > 3 ? styles.centerAligned : styles.leftAligned;

  return (
    <div className={styles.dashboard_container}>
        
        <div className={styles.dashboard_wrapper}>
            <div className={styles.blur1}>
              <Blur green />
            </div>
            <div className={styles.blur2}>
              <Blur green />
            </div>

            {/* Profile Card */}
            {identity ? <ProfileCard identity={identity} addressOrDomain={addressOrDomain} userPercentile={userPercentile} /> : <div className={styles.dashboard_profile_card}>Fetching data...</div> }
      
        </div>

        {/* Completed Quests */}
        <div className={styles.dashboard_completed_tasks_container}>
            <div className={styles.second_header_label}>
                <h2 className={styles.second_header}>Quests Completed</h2>
            </div>
            
            <div className={`${styles.quests_container} ${containerClass}`}>
              
                <CompletedQuests completedQuests={completedQuests} />
                
                {quests?.length === 0 && (
                  <h2 className={styles.noBoosts}>
                    No completed quests at the moment.
                  </h2>
                )}
                
            </div>
            
        </div>
          
    </div>
  );
}
