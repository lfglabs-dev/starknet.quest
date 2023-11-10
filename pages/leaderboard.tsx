import React, { useCallback, useContext, useEffect, useState } from "react";
import ChipList from "../components/UI/ChipList";
import RankCard from "../components/leaderboard/RankCard";
import {
  fetchLeaderboardRankings,
  fetchLeaderboardToppers,
} from "../services/apiService";
import { calculatePercentile } from "../utils/numberService";
import styles from "../styles/leaderboard.module.css";
import { useAccount } from "@starknet-react/core";
import LeaderboardSkeleton from "../components/skeletons/leaderboardSkeleton";
import FeaturedQuest from "../components/UI/featured_banner/featuredQuest";
import { QuestsContext } from "../context/QuestsProvider";
import { useRouter } from "next/router";
import Searchbar from "../components/leaderboard/searchbar";
import Divider from "@mui/material/Divider";
import Blur from "../components/shapes/blur";
import RankingsTable from "../components/leaderboard/RankingsTable";
import { timeFrameMap } from "../utils/constants";
import ControlsDashboard from "../components/leaderboard/ControlsDashboard";
import { hexToDecimal } from "../utils/feltService";

export default function Leaderboard() {
  const router = useRouter();
  const { status, address } = useAccount();
  const { featuredQuest } = useContext(QuestsContext);

  const [duration, setDuration] = useState<string>("Last 7 Days");
  const [userPercentile, setUserPercentile] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchAddress, setSearchAddress] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string>("");
  const [ranking, setRanking] = useState<RankingData>({
    first_elt_position: 0,
    ranking: [],
  });

  useEffect(() => {
    if (address === "") return;
    if (address) setUserAddress(address);
  }, [address]);

  useEffect(() => {
    const fetchResults = async () => {
      const requestBody = {
        addr:
          status === "connected"
            ? hexToDecimal(address?.length > 0 ? address : userAddress)
            : "",
        page_size: 10,
        shift: 0,
        start_timestamp: new Date().setDate(new Date().getDate() - 7),
        end_timestamp: new Date().getTime(),
      };

      const rankingData = await fetchLeaderboardRankings(requestBody);
      const topperData = await fetchLeaderboardToppers({
        addr: status === "connected" ? hexToDecimal(address) : "",
      });
      setRanking(rankingData);
      setLeaderboardToppers(topperData);

      setLoading(false);
    };

    if (userAddress) fetchResults();
  }, [userAddress, status]);

  const [leaderboardToppers, setLeaderboardToppers] =
    useState<LeaderboardToppersData>({
      weekly: {
        best_users: [],
        length: 0,
      },
      monthly: {
        best_users: [],
        length: 0,
      },
      all_time: {
        best_users: [],
        length: 0,
      },
    });

  const handleChangeSelection = (title: string) => {
    setDuration(title);
  };

  // on user typing
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // on user Press enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setSearchAddress(searchQuery);
    }
  };

  // function to calculate time range based on duration
  const getTimeRange = () => {
    switch (duration) {
      case "Last 7 Days":
        return {
          start_timestamp: new Date().setDate(new Date().getDate() - 7),
          end_timestamp: new Date().getTime(),
        };
      case "Last 30 Days":
        return {
          start_timestamp: new Date().setDate(new Date().getDate() - 30),
          end_timestamp: new Date().getTime(),
        };
      case "All time":
        return {
          start_timestamp: 0,
          end_timestamp: new Date().getTime(),
        };
      default:
        // be default return weekly data
        return {
          start_timestamp: new Date().setDate(new Date().getDate() - 7),
          end_timestamp: new Date().getTime(),
        };
    }
  };

  /*
    fetch data whenever page size , page number changes, 
    duration  changes, search address changes
  */
  useEffect(() => {
    const requestBody = {
      addr:
        searchAddress.length > 0
          ? hexToDecimal(searchAddress)
          : hexToDecimal(address),
      page_size: rowsPerPage,
      shift: currentPage,
      ...getTimeRange(),
    };

    const fetchRankings = async () => {
      setPaginationLoading(true);
      const rankingData = await fetchLeaderboardRankings(requestBody);
      setRanking(rankingData);
    };

    fetchRankings();
  }, [rowsPerPage, currentPage, duration, searchAddress]);

  // handle pagination with forward and backward direction as params
  const handlePagination = (type: string) => {
    if (type === "next") {
      setCurrentPage((prev) => prev + 1);
    } else {
      // type==='prev' is this case
      setCurrentPage((prev) => prev - 1);
    }
  };

  // used to calculate user percentile as soon as required data is fetched
  useEffect(() => {
    // check if the user has position on the leaderboard
    if (
      !leaderboardToppers?.[
        timeFrameMap[
          duration as keyof typeof timeFrameMap
        ] as keyof typeof leaderboardToppers
      ]?.position
    ) {
      setUserPercentile(-1);
      return;
    }

    // calculate user percentile
    const res = calculatePercentile(
      leaderboardToppers[
        timeFrameMap[
          duration as keyof typeof timeFrameMap
        ] as keyof typeof leaderboardToppers
      ]?.position ?? 0,
      leaderboardToppers[
        timeFrameMap[
          duration as keyof typeof timeFrameMap
        ] as keyof typeof leaderboardToppers
      ]?.length ?? 0
    );
    setUserPercentile(res);
  }, [leaderboardToppers]);

  return (
    <div className={styles.leaderboard_container}>
      {loading ? (
        <div className={styles.leaderboard_skeleton}>
          <LeaderboardSkeleton />
        </div>
      ) : (
        <>
          <div className={styles.leaderboard_quest_banner}>
            <div className={styles.blur1}>
              <Blur green />
            </div>
            <div className={styles.blur2}>
              <Blur green />
            </div>

            <FeaturedQuest
              heading="Are you ready for this quest?"
              key={featuredQuest?.id}
              title={featuredQuest?.title_card}
              onClick={() => router.push(`/quest/${featuredQuest?.id}`)}
              imgSrc={featuredQuest?.img_card}
              issuer={{
                name: featuredQuest?.issuer ?? "",
                logoFavicon: featuredQuest?.logo ?? "",
              }}
              reward={featuredQuest?.rewards_title}
              desc={featuredQuest?.desc}
              expiry={featuredQuest?.expiry_timestamp}
            />
          </div>
          <div className={styles.leaderboard_layout}>
            <div className={styles.leaderboard_topbar}>
              <div style={{ flex: 0.4 }}>
                <p className={styles.leaderboard_heading}>Leaderboard</p>
              </div>
              <div className={styles.leaderboard_chiplist} style={{ flex: 1 }}>
                <ChipList
                  selected={duration}
                  handleChangeSelection={handleChangeSelection}
                  tags={["Last 7 Days", "Last 30 Days", "All time"]}
                />
              </div>
              <div style={{ flex: 0.4 }}></div>
            </div>

            {/* this will be displayed if user is present otherwise will not be displayed */}
            {userPercentile >= 0 ? (
              <div className={styles.percentile_text_container}>
                <p className={styles.percentile_text_normal}>
                  {address === userAddress ? "You are" : "He is"}
                </p>
                <span className={styles.percentile_text_green}>
                  &nbsp;better than {userPercentile}%&nbsp;
                </span>
                <p className={styles.percentile_text_normal}>
                  of the other players
                </p>
              </div>
            ) : null}
            <Divider
              orientation="horizontal"
              variant="fullWidth"
              className={styles.divider}
            />

            {/* this will be if searched user is not present in leaderboard or server returns 500 */}
            {ranking ? (
              <>
                <RankingsTable
                  data={ranking}
                  selectedAddress={hexToDecimal(userAddress)}
                  paginationLoading={paginationLoading}
                  setPaginationLoading={setPaginationLoading}
                />
                <ControlsDashboard
                  ranking={ranking}
                  handlePagination={handlePagination}
                  leaderboardToppers={leaderboardToppers}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  duration={duration}
                />
                <Divider
                  orientation="horizontal"
                  variant="fullWidth"
                  className={styles.divider}
                />
              </>
            ) : null}

            <div className={styles.leaderboard_topper_layout}>
              {leaderboardToppers
                ? leaderboardToppers[
                    timeFrameMap[
                      duration as keyof typeof timeFrameMap
                    ] as keyof typeof leaderboardToppers
                  ]?.best_users?.map((item, index) => (
                    <RankCard
                      position={index + 1}
                      key={index}
                      name={item.address}
                      experience={item.xp}
                      trophy={item.achievements}
                    />
                  ))
                : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
