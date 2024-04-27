"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "@styles/dashboard.module.css";
import ProfileCard from "@components/UI/profileCard/profileCard";
import {
  fetchLeaderboardRankings,
  fetchLeaderboardToppers,
  getCompletedQuests,
  getQuestById,
} from "@services/apiService";
import { useAccount } from "@starknet-react/core";

import Blur from "@components/shapes/blur";
import { utils } from "starknetid.js";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import { hexToDecimal } from "@utils/feltService";
import { isHexString, minifyAddress } from "@utils/stringService";
import CompletedQuests from "@components/dashboard/completedQuests";

import ProfileCardSkeleton from "@components/skeletons/profileCardSkeleton";
import { getDataFromId } from "@services/starknetIdService";
import { usePathname, useRouter } from "next/navigation";
import ErrorScreen from "@components/UI/screens/errorScreen";
import { QuestDocument } from "../../types/backTypes";
import QuestSkeleton from "@components/skeletons/questsSkeleton";

type AddressOrDomainProps = {
  params: {
    addressOrDomain: string;
  };
};

export default function DashboardPage({ params }: AddressOrDomainProps) {
  const router = useRouter();
  const addressOrDomain = params.addressOrDomain;
  const { address } = useAccount();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [initProfile, setInitProfile] = useState(false);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardToppersData>({
      best_users: [],
      total_users: 0,
    });
  const [identity, setIdentity] = useState<Identity>();
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [quests, setQuests] = useState<QuestDocument[]>([]);
  const [userRanking, setUserRanking] = useState<RankingData>({
    first_elt_position: 0,
    ranking: [],
  });
  const dynamicRoute = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) setIsOwner(false);
  }, [address]);

  const fetchCompletedQuests = useCallback(
    async (addr: string) => {
      try {
        if (!addr) return;
        const res = await getCompletedQuests(addr);

        const updatedQuestsResults = await Promise.allSettled(
          res.map((id: number) => getQuestById(id))
        );
        const successfulCompletedQuests = updatedQuestsResults
          .filter(
            (result): result is PromiseFulfilledResult<QuestDocument> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);

        const questCards = successfulCompletedQuests;

        setQuests((prevQuests: QuestDocument[]) => [
          ...prevQuests,
          ...questCards.filter((quest) => quest !== null),
        ]);
      } catch (err) {
        console.log("Error while fetching quests", err);
      }
    },
    [address, identity]
  );

  const fetchRanking = useCallback(
    async (addr: string) => {
      try {
        if (!addr) return;
        const res = await fetchLeaderboardRankings({
          addr: addr,
          page_size: 10,
          shift: 0,
          duration: "all",
        });
        setUserRanking(res);
      } catch (err) {
        console.log("Error while fetching leaderboard position", err);
      }
    },
    [address]
  );

  const fetchLeaderboardData = useCallback(
    async (addr: string) => {
      try {
        if (!addr) return;
        const res = await fetchLeaderboardToppers({
          addr: addr,
          duration: "all",
        });
        setLeaderboardData(res);
      } catch (err) {
        console.log("Error while fetching leaderboard position", err);
      }
    },
    [address]
  );

  const fetchPageData = useCallback(async (addr: string) => {
    setLoading(true);
    await fetchCompletedQuests(addr);
    await fetchRanking(addr);
    await fetchLeaderboardData(addr);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!identity) return;
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
        <div className={styles.second_header_label}>
          <h2 className={styles.second_header}>Quests Completed</h2>
        </div>

        <div className={styles.quests_container}>
          {loading ? (
            <QuestSkeleton />
          ) : quests?.length === 0 ? (
            <h2 className={styles.noBoosts}>
              {isOwner
                ? "You have not completed any quests at the moment"
                : "User has not completed any quests at the moment"}
            </h2>
          ) : (
            <CompletedQuests completedQuests={quests} />
          )}
        </div>
      </div>
    </div>
  );
}
