"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ChipList from "@components/UI/ChipList";
import {
  fetchLeaderboardRankings,
  fetchLeaderboardToppers,
} from "@services/apiService";
import { calculatePercentile } from "@utils/numberService";
import styles from "@styles/leaderboard.module.css";
import { useAccount } from "@starknet-react/core";
import LeaderboardSkeleton from "@components/skeletons/leaderboardSkeleton";
import FeaturedQuest from "@components/UI/featured_banner/featuredQuest";
import { QuestsContext } from "@context/QuestsProvider";
import { useRouter } from "next/navigation";
import Searchbar from "@components/leaderboard/searchbar";
import { getDomainWithoutStark } from "@utils/stringService";
import { useDebounce } from "@hooks/useDebounce";
import { Abi, Contract, Provider } from "starknet";
import naming_abi from "@abi/naming_abi.json";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import { utils } from "starknetid.js";
import { isStarkDomain } from "starknetid.js/packages/core/dist/utils";
import Divider from "@mui/material/Divider";
import Blur from "@components/shapes/blur";
import RankingsTable from "@components/leaderboard/RankingsTable";
import { TOP_50_TAB_STRING } from "@constants/common";
import { hexToDecimal } from "@utils/feltService";
import Avatar from "@components/UI/avatar";
import RankingSkeleton from "@components/skeletons/rankingSkeleton";
import { Button } from "@mui/material";
import Link from "next/link";
import { timeFrameMap } from "@utils/timeService";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import {
  LeaderboardRankingParams,
  LeaderboardTopperParams,
} from "../../types/backTypes";

export default function Page() {
  const router = useRouter();
  const { status, address, isConnecting } = useAccount();
  const { featuredQuest } = useContext(QuestsContext);

  const [viewMore, setViewMore] = useState(true);
  const [duration, setDuration] = useState<string>("Last 7 Days");
  const [userPercentile, setUserPercentile] = useState<number>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [apiCallDelay, setApiCallDelay] = useState<boolean>(false);
  const searchAddress = useDebounce<string>(searchQuery, 200);
  const [currentSearchedAddress, setCurrentSearchedAddress] =
    useState<string>("");
  const rowsPerPage = useMemo(() => 10, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [rankingdataloading, setRankingdataloading] = useState<boolean>(false);
  const [showNoresults, setShowNoresults] = useState(false);
  const [userAddress, setUserAddress] = useState<string>("");
  const [ranking, setRanking] = useState<RankingData>({
    first_elt_position: 0,
    ranking: [],
  });
  const [inititalFetchTop50, setInititalFetchTop50] = useState(false);

  const isTop50RankedView = useMemo(
    () =>
      !currentSearchedAddress &&
      (duration === TOP_50_TAB_STRING || (!isConnecting && !address)),
    [currentSearchedAddress, duration, isConnecting, address]
  );
  const isNoSearchResults = useMemo(
    () =>
      ranking.ranking.length === 0 && currentSearchedAddress ? true : false,
    [ranking.ranking.length, currentSearchedAddress]
  );
  // to check if current view is the default view or a user requested view(to prevent multiple api calls)
  const [isCustomResult, setCustomResult] = useState<boolean>(false);

  // set user address on wallet connect and disconnect
  useEffect(() => {
    setTimeout(() => {
      setApiCallDelay(true);
    }, 1000);
    if (address === "") return;
    if (address) setUserAddress(address);
    if (status === "disconnected") setUserAddress("");
  }, [address, status]);

  useEffect(() => {
    if (!apiCallDelay) return;
    fetchPageData();
  }, [apiCallDelay]);

  const fetchRankingResults = useCallback(
    async (requestBody: LeaderboardRankingParams) => {
      const response = await fetchLeaderboardRankings(requestBody);
      if (response) setRanking(response);
      if (response && !requestBody.addr) setInititalFetchTop50(true);
      else setInititalFetchTop50(false);
    },
    [address]
  );

  const addRankingResults = useCallback(
    async (requestBody: LeaderboardRankingParams) => {
      const response = await fetchLeaderboardRankings(requestBody);
      if (response)
        setRanking((prev) => {
          return { ...prev, ranking: [...prev.ranking, ...response.ranking] };
        });
    },
    []
  );

  const fetchLeaderboardToppersResult = useCallback(
    async (requestBody: LeaderboardTopperParams) => {
      const topperData = await fetchLeaderboardToppers(requestBody);
      if (topperData) setLeaderboardToppers(topperData);
    },
    []
  );

  const fetchPageData = useCallback(async () => {
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
    setRankingdataloading(false);
  }, [
    fetchRankingResults,
    fetchLeaderboardToppersResult,
    address,
    userAddress,
    status,
  ]);

  const [leaderboardToppers, setLeaderboardToppers] =
    useState<LeaderboardToppersData>({
      best_users: [],
      total_users: 0,
    });

  const contract = useMemo(() => {
    return new Contract(
      naming_abi as Abi,
      process.env.NEXT_PUBLIC_NAMING_CONTRACT as string,
      starknetIdNavigator?.provider as Provider
    );
  }, [starknetIdNavigator?.provider]);

  // contract call to check if typed domain is taken
  async function verifyDomain(domain: string): Promise<{ message: boolean }> {
    if (!domain) return { message: false };
    const currentTimeStamp = new Date().getTime() / 1000;
    const encoded = utils.encodeDomain(domain).map((elem) => elem.toString());
    const res = await contract?.call("domain_to_expiry", [encoded]);
    if (Number(res?.["expiry" as keyof typeof res]) < currentTimeStamp) {
      return {
        message: false,
      };
    } else {
      return {
        message: true,
      };
    }
  }

  // to reset the page shift when duration is changes or new address is searched
  useEffect(() => {
    setCurrentPage(1);
    setViewMore(true);
  }, [duration, currentSearchedAddress]);

  // on user selecting duration
  const handleChangeSelection = (title: string) => {
    setDuration(title);
    setCustomResult(true);
  };

  // on user typing
  const handleChange = (query: string) => {
    setSearchQuery(query);
  };

  // this will be called when the search address is debounced and updated and suggestions will be loaded
  useEffect(() => {
    const checkIfValidAddress = async (address: string) => {
      try {
        let domain = address;
        if (isStarkDomain(address)) {
          domain = getDomainWithoutStark(address);
        }
        const res: { message: boolean } = await verifyDomain(domain);
        if (res.message) {
          setSearchResults([domain.concat(".stark")]);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        setSearchResults([]);
      }
    };

    if (searchAddress.length > 0) {
      checkIfValidAddress(searchAddress);
    }
  }, [searchAddress]);

  // on user Press enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(searchQuery);
      setCurrentSearchedAddress(searchQuery);
    }
  };

  const checkIfLastPage = useMemo(() => {
    /*
    check if the current page is the last page

    first_elt_position is the index of the first element in the current page
    and ranking.length is the number of elements in the current page

    so if the sum of these two is greater than the number of players in the
    leaderboard toppers api response, then we are on the last page
    */

    if (
      ranking?.first_elt_position + ranking?.ranking?.length >=
      leaderboardToppers?.total_users
    )
      return true;
    return false;
  }, [leaderboardToppers, ranking, duration]);

  const handleViewMore = useCallback(() => {
    if (checkIfLastPage && !viewMore) {
      setViewMore(true);
      return;
    }
    if (!checkIfLastPage && viewMore) {
      const requestBody = {
        addr:
          currentSearchedAddress.length > 0
            ? currentSearchedAddress
            : userAddress
            ? hexToDecimal(userAddress)
            : "",
        page_size: rowsPerPage,
        shift: currentPage,
        duration: timeFrameMap(duration),
      };

      addRankingResults(requestBody);
      setCurrentPage((prev) => prev + 1);
      return;
    }
    if (checkIfLastPage && viewMore) {
      setViewMore(false);
    }
  }, [
    viewMore,
    checkIfLastPage,
    currentSearchedAddress,
    userAddress,
    rowsPerPage,
    currentPage,
    duration,
  ]);

  /*
    fetch data whenever page size , page number changes, 
    duration  changes, search address changes
  */
  useEffect(() => {
    const requestBody = {
      addr:
        currentSearchedAddress.length > 0
          ? currentSearchedAddress
          : userAddress
          ? hexToDecimal(userAddress)
          : address
          ? address
          : "",
      page_size: rowsPerPage,
      shift: 0,
      duration: timeFrameMap(duration),
    };

    const getTop50RequestBody: LeaderboardRankingParams = {
      addr: "",
      page_size: 50,
      shift: 0,
      duration: "all",
    };

    setPaginationLoading(true);
    fetchRankingResults(isTop50RankedView ? getTop50RequestBody : requestBody);

    fetchLeaderboardToppersResult({
      addr: requestBody.addr,
      duration: timeFrameMap(duration),
    });
  }, [rowsPerPage, currentSearchedAddress, isCustomResult, duration, address]);

  useEffect(() => {
    if (inititalFetchTop50 && address && duration !== TOP_50_TAB_STRING) {
      const requestBody = {
        addr:
          currentSearchedAddress.length > 0
            ? currentSearchedAddress
            : userAddress
            ? hexToDecimal(userAddress)
            : address
            ? address
            : "",
        page_size: rowsPerPage,
        shift: 0,
        duration: timeFrameMap(duration),
      };

      const getTop50RequestBody: LeaderboardRankingParams = {
        addr: "",
        page_size: 50,
        shift: 0,
        duration: "all",
      };

      setPaginationLoading(true);
      fetchRankingResults(
        isTop50RankedView ? getTop50RequestBody : requestBody
      );

      fetchLeaderboardToppersResult({
        addr: requestBody.addr,
        duration: timeFrameMap(duration),
      });
    }
  }, [ranking]);

  // used to calculate user percentile as soon as required data is fetched
  useEffect(() => {
    // check if the user has position on the leaderboard
    if (!leaderboardToppers?.position) {
      setUserPercentile(-1);
      if (currentSearchedAddress.length > 0) setShowNoresults(true);
      else {
        setShowNoresults(false);
      }
      return;
    }

    // calculate user percentile
    const res = calculatePercentile(
      leaderboardToppers?.position ?? 0,
      leaderboardToppers?.total_users ?? 0
    );
    setUserPercentile(res);
    setShowNoresults(false);
  }, [leaderboardToppers, currentSearchedAddress, duration]);

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
              questId={featuredQuest?.id}
            />
          </div>
          <div className={styles.leaderboard_layout}>
            <div className={styles.leaderboard_topbar}>
              <div style={{ flex: 0.4 }}>
                <Typography
                  type={TEXT_TYPE.BODY_MIDDLE}
                  className={styles.leaderboard_heading}
                >
                  Leaderboard
                </Typography>
              </div>
              <div className={styles.leaderboard_chiplist} style={{ flex: 1 }}>
                <ChipList
                  selected={duration}
                  handleChangeSelection={handleChangeSelection}
                  tags={[
                    "Last 7 Days",
                    "Last 30 Days",
                    "All time",
                    TOP_50_TAB_STRING,
                  ]}
                />
              </div>
              <div style={{ flex: 0.4 }} className="w-full">
                <Searchbar
                  value={searchQuery}
                  handleChange={handleChange}
                  onKeyDown={handleKeyDown}
                  suggestions={searchResults}
                  handleSuggestionClick={(address) => {
                    setCurrentSearchedAddress(address);
                    setSearchResults([]);
                    setCustomResult(true);
                  }}
                />
              </div>
            </div>

            {/* this will be displayed if user is present otherwise will not be displayed */}
            {userPercentile ? (
              userPercentile >= 0 ? (
                <div className={styles.percentile_container}>
                  {currentSearchedAddress.length > 0 || userAddress ? (
                    <div className="hidden md:block">
                      <Avatar
                        address={
                          currentSearchedAddress.length > 0
                            ? currentSearchedAddress
                            : userAddress
                        }
                      />
                    </div>
                  ) : null}
                  <div className={styles.percentile_text_container}>
                    <Typography
                      type={TEXT_TYPE.BODY_DEFAULT}
                      color="textGray"
                      className={styles.percentile_text_normal}
                    >
                      {currentSearchedAddress.length > 0 ? "He is" : "You are "}
                    </Typography>
                    <span className={styles.percentile_text_green}>
                      &nbsp;better than {userPercentile}%&nbsp;
                    </span>
                    <Typography
                      type={TEXT_TYPE.BODY_DEFAULT}
                      color="textGray"
                      className={styles.percentile_text_normal}
                    >
                      of the other players
                    </Typography>
                  </div>
                </div>
              ) : address ? (
                <div className={styles.percentile_container}>
                  <Typography
                    type={TEXT_TYPE.BODY_DEFAULT}
                    color="textGray"
                    className={styles.percentile_text_normal}
                  >
                    You werent active this week. ready to jump back in?
                  </Typography>
                  <Link href="/">
                    <Typography
                      type={TEXT_TYPE.BODY_DEFAULT}
                      color="white"
                      className={styles.percentile_text_link}
                    >
                      Start your quest
                    </Typography>
                  </Link>
                </div>
              ) : null
            ) : null}
            <Divider
              orientation="horizontal"
              variant="fullWidth"
              className={styles.divider}
            />

            {/* shows loader skeleton while data is still being fetched*/}

            {rankingdataloading ? (
              <RankingSkeleton />
            ) : ranking ? (
              isNoSearchResults ? (
                // {/* this will be displayed if searched user is not present in leaderboard or server returns 500*/}
                <div className={styles.no_result_container}>
                  <img
                    src="/visuals/animals/tiger.webp"
                    height={256}
                    width={254}
                    alt="error image"
                  />
                  <Typography
                    type={TEXT_TYPE.BODY_DEFAULT}
                    className="pb-[1.5rem]"
                  >
                    No Results Found! Try a new search
                  </Typography>
                  <Divider
                    orientation="horizontal"
                    variant="fullWidth"
                    className={styles.divider}
                  />
                </div>
              ) : (
                <>
                  <RankingsTable
                    duration={duration}
                    data={
                      checkIfLastPage && !viewMore
                        ? { ...ranking, ranking: ranking.ranking.slice(0, 10) }
                        : ranking
                    }
                    selectedAddress={
                      currentSearchedAddress.length > 0
                        ? currentSearchedAddress
                        : hexToDecimal(userAddress)
                    }
                    searchedAddress={currentSearchedAddress}
                    leaderboardToppers={leaderboardToppers}
                    paginationLoading={paginationLoading}
                    setPaginationLoading={setPaginationLoading}
                  />
                </>
              )
            ) : (
              <div className={styles.no_result_container}>
                <Typography
                  type={TEXT_TYPE.BODY_DEFAULT}
                  className="pb-[1.5rem] text-[1.5rem]"
                >
                  Something went wrong! Try again...
                </Typography>
                <Divider
                  orientation="horizontal"
                  variant="fullWidth"
                  className={styles.divider}
                />
              </div>
            )}
            {duration !== TOP_50_TAB_STRING &&
              (address || (!isNoSearchResults && currentSearchedAddress)) &&
              !isNoSearchResults && (
                <Button
                  onClick={handleViewMore}
                  variant="text"
                  disableRipple
                  className="w-fit text-white text self-center"
                  style={{ textTransform: "none" }}
                >
                  {checkIfLastPage && viewMore ? "View less" : "View more"}
                </Button>
              )}
          </div>
        </>
      )}
    </div>
  );
}
