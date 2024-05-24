"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "@styles/dashboard.module.css";
import ProfileCard from "@components/UI/profileCard/profileCard";
import {
  fetchLeaderboardRankings,
  fetchLeaderboardToppers,
  getCompletedQuests,
  getPendingBoostClaims,
} from "@services/apiService";
import { useAccount } from "@starknet-react/core";
import Blur from "@components/shapes/blur";
import { utils } from "starknetid.js";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import { hexToDecimal } from "@utils/feltService";
import { isHexString, minifyAddress } from "@utils/stringService";
import ProfileCardSkeleton from "@components/skeletons/profileCardSkeleton";
import { getDataFromId } from "@services/starknetIdService";
import { usePathname, useRouter } from "next/navigation";
import ErrorScreen from "@components/UI/screens/errorScreen";
import { ClaimableQuestDocument, CompletedQuests, PendingBoostClaim, QuestDocument } from "../../types/backTypes";
import QuestSkeleton from "@components/skeletons/questsSkeleton";
import QuestCardCustomised from "@components/dashboard/CustomisedQuestCard";
import QuestStyles from "@styles/Home.module.css";
import { QuestsContext } from "@context/QuestsProvider";
import { Tab, Tabs } from "@mui/material";
import { CustomTabPanel, a11yProps } from "@components/pages/home/questAndCollectionTabs";
import { getClaimableQuests } from "@utils/quest";
import QuestClaim from "@components/quests/questClaim";

type AddressOrDomainProps = {
  params: {
    addressOrDomain: string;
  };
};

export default function Page({ params }: AddressOrDomainProps) {
  const router = useRouter();
  const addressOrDomain = params.addressOrDomain;
  const { address } = useAccount();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [initProfile, setInitProfile] = useState(false);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardToppersData>({
      best_users: [],
      total_users: -1,
    });
  const [identity, setIdentity] = useState<Identity>();
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<CompletedQuests>([]);
  const [userRanking, setUserRanking] = useState<RankingData>({
    first_elt_position: -1,
    ranking: [],
  });
  const dynamicRoute = usePathname();
  const [questsLoading, setQuestsLoading] = useState(true);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [claimableQuests, setClaimableQuests] = useState<ClaimableQuestDocument[]>([]);
  const [pendingBoostClaims, setPendingBoostClaims] = useState<
    PendingBoostClaim[] | undefined
  >([]);

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabIndex(newValue);
    },
    []
  );

  const { quests } = useContext(QuestsContext);

  useEffect(() => {
    if (!address) setIsOwner(false);
  }, [address]);

  const fetchCompletedQuests = useCallback(
    async (addr: string) => {
      try {
        if (!addr) return;
        const res = await getCompletedQuests(addr);
        if (!res || "error" in res) return;
        setCompletedQuests(res);
      } catch (err) {
        console.log("Error while fetching quests", err);
      }
    },
    [address, identity]
  );


  useEffect(() => {
    const getAllPendingBoostClaims = async () => {
      const allPendingClaims = await getPendingBoostClaims(
        hexToDecimal(address)
      );
      if (allPendingClaims) {
        setPendingBoostClaims(allPendingClaims);
      }
    };

    getAllPendingBoostClaims();
  }, [address]);

  useEffect(() => {
    const data = getClaimableQuests(quests, pendingBoostClaims);
    if (data) {
      setClaimableQuests(data);
    }
  }, [address, pendingBoostClaims, quests]);

  const fetchRanking = useCallback(
    async (addr: string) => {
      if (!addr) return;
      const res = await fetchLeaderboardRankings({
        addr: hexToDecimal(addr),
        page_size: 10,
        shift: 0,
        duration: "all",
      });
      if (!res) return;
      setUserRanking(res);
    },
    [address]
  );

  const fetchLeaderboardData = useCallback(
    async (addr: string) => {
      if (!addr) return;
      const res = await fetchLeaderboardToppers({
        addr: hexToDecimal(addr),
        duration: "all",
      });
      if (!res) return;
      setLeaderboardData(res);
    },
    [address]
  );

  const fetchPageData = useCallback(async (addr: string) => {
    await fetchRanking(addr);
    await fetchLeaderboardData(addr);
  }, []);

  const fetchQuestData = useCallback(async (addr: string) => {
    setQuestsLoading(true);
    await fetchCompletedQuests(addr);
    setQuestsLoading(false);
  }, []);

  useEffect(() => {
    if (!identity) return;
    fetchQuestData(identity.owner);
    fetchPageData(identity.owner);
  }, [identity]);

  useEffect(() => setNotFound(false), [dynamicRoute]);

  useEffect(() => {
    setInitProfile(false);
  }, [address, addressOrDomain]);

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
            getDataFromId(id).then((data: Identity) => {
              if (data.error) {
                setNotFound(true);
                return;
              }
              setIdentity({
                ...data,
                id: id.toString(),
              });
              if (hexToDecimal(address) === hexToDecimal(data.owner))
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
              id: "0",
              owner: addr,
              domain: { domain: addressOrDomain },
              main: false,
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
                  getDataFromId(id).then((data: Identity) => {
                    if (data.error) return;
                    setIdentity({
                      ...data,
                      id: id.toString(),
                    });
                    if (hexToDecimal(address) === hexToDecimal(data.owner))
                      setIsOwner(true);
                    setInitProfile(true);
                  });
                })
                .catch(() => {
                  return;
                });
            } else {
              setIdentity({
                id: "0",
                owner: addressOrDomain,
                domain: { domain: name },
                main: false,
              });
              setInitProfile(true);
              if (hexToDecimal(addressOrDomain) === hexToDecimal(address))
                setIsOwner(true);
            }
          } else {
            setIdentity({
              id: "0",
              owner: addressOrDomain,
              domain: { domain: minifyAddress(addressOrDomain) },
              main: false,
            });
            setIsOwner(false);
            setInitProfile(true);
          }
        })
        .catch(() => {
          setIdentity({
            id: "0",
            owner: addressOrDomain,
            domain: { domain: minifyAddress(addressOrDomain) },
            main: false,
          });
          setInitProfile(true);
          if (hexToDecimal(addressOrDomain) === hexToDecimal(address))
            setIsOwner(true);
        });
    } else {
      setNotFound(true);
    }
  }, [addressOrDomain, address, dynamicRoute]);

  if (notFound) {
    return (
      <ErrorScreen
        errorMessage="Profile or Page not found"
        buttonText="Go back to quests"
        onClick={() => router.push("/")}
      />
    );
  }

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.dashboard_wrapper}>
        <div className={styles.blur1}>
          <Blur green />
        </div>
        <div className={styles.blur2}>
          <Blur green />
        </div>
        {initProfile && identity ? (
          <ProfileCard
            identity={identity}
            addressOrDomain={addressOrDomain}
            rankingData={userRanking}
            leaderboardData={leaderboardData}
            isOwner={isOwner}
          />
        ) : (
          <ProfileCardSkeleton />
        )}
      </div>

      {/* Completed Quests */}
      <div className={styles.dashboard_completed_tasks_container}>
        <div>
          <Tabs
            style={{
              borderBottom: "0.5px solid rgba(224, 224, 224, 0.3)",
            }}
            className="pb-6"
            value={tabIndex}
            onChange={handleChangeTab}
            aria-label="quests and collectons tabs"
            indicatorColor="secondary"
            id="questCollectionTab"
          >
            <Tab
              disableRipple
              sx={{
                borderRadius: "10px",
                padding: "0px 12px 0px 12px",
                textTransform: "none",
                fontWeight: "600",
                fontSize: "12px",
                fontFamily: "Sora",
                minHeight: "32px",
                marginRight: "10px",
                transition: "900ms background-color, 900ms color ease-in-out",
              }}
              label={`Completed (${completedQuests.length ?? 0})`}
              {...a11yProps(0)}
            />
            <Tab
              disableRipple
              sx={{
                borderRadius: "10px",
                padding: "0px 12px 0px 12px",
                textTransform: "none",
                fontWeight: "600",
                fontSize: "12px",
                fontFamily: "Sora",
                minHeight: "32px",
                transition: "900ms background-color, 900ms color ease-in-out",
              }}
              label={`To claim (${
                claimableQuests ? claimableQuests.length : 0
              })`}
              {...a11yProps(1)}
            />
          </Tabs>
        </div>
        <CustomTabPanel value={tabIndex} index={0}>
          <div className={styles.quests_container}>
            {questsLoading ? (
              <QuestSkeleton />
            ) : completedQuests?.length === 0 ? (
              <h2 className={styles.noBoosts}>
                {isOwner
                  ? "You have not completed any quests at the moment"
                  : "User has not completed any quests at the moment"}
              </h2>
            ) : (
              <section className={QuestStyles.section}>
                <div className={QuestStyles.questContainer}>
                  {completedQuests?.length > 0 &&
                    completedQuests?.map((quest) => (
                      <QuestCardCustomised key={quest} id={quest} />
                    ))}
                </div>
              </section>
            )}
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={tabIndex} index={1}>
          {questsLoading ? (
            <QuestSkeleton />
          ) : (
            <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
              {claimableQuests &&
                claimableQuests.map((quest) => (
                  <QuestClaim
                    key={quest.id}
                    title={quest.title_card}
                    onClick={() => router.push(`/quest-boost/${quest.boostId}`)}
                    imgSrc={quest.img_card}
                    name={quest.issuer}
                    reward={quest.rewards_title}
                    id={quest.boostId}
                    expired={quest.expired}
                  />
                ))}
            </div>
          )}
        </CustomTabPanel>
      </div>
    </div>
  );
}
