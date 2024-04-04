"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ChipList from "@components/UI/ChipList";
import RankCard from "@components/leaderboard/RankCard";
import {
  LeaderboardRankingParams,
  LeaderboardTopperParams,
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
import { rankOrder, rankOrderMobile } from "@constants/common";
import ControlsDashboard from "@components/leaderboard/ControlsDashboard";
import { decimalToHex, hexToDecimal } from "@utils/feltService";
import Avatar from "@components/UI/avatar";
import RankingSkeleton from "@components/skeletons/rankingSkeleton";
import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import { timeFrameMap } from "@utils/timeService";

export default function Page() {
  const router = useRouter();
  const { status, address } = useAccount();
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
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [rankingdataloading, setRankingdataloading] = useState<boolean>(false);
  const [showNoresults, setShowNoresults] = useState(false);
  const [userAddress, setUserAddress] = useState<string>("");
  const isMobile = useMediaQuery("(max-width:768px)");
  const [ranking, setRanking] = useState<RankingData>({
    first_elt_position: 0,
    ranking: [],
  });

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

  const fetchLeaderboardToppersResult = useCallback( // ovo treba
    async (requestBody: LeaderboardTopperParams) => {
      const topperData = await fetchLeaderboardToppers(requestBody);
      setLeaderboardToppers(topperData);
      
    },
    []
  );

const fetchPageData=useCallback(async ()=> { // ovo treba
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
  await fetchRankingResults(requestBody);
  setRankingdataloading(false);

},[fetchRankingResults,fetchLeaderboardToppersResult,address,userAddress,status]);



  const [leaderboardToppers, setLeaderboardToppers] = // ovo treba
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
    setCurrentPage(0);
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
    if (!isCustomResult) return;
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

    setPaginationLoading(true);
    fetchRankingResults(requestBody);
    fetchLeaderboardToppersResult({
      addr: requestBody.addr,
      duration: timeFrameMap(duration),
    });
  }, [
    rowsPerPage,
    currentPage,
    currentSearchedAddress,
    isCustomResult,
    duration,
  ]);

  // handle pagination with forward and backward direction as params
  const handlePagination = (type: string) => {
    setCustomResult(true);
    if (type === "next") {
      setCurrentPage((prev) => prev + 1);
    } else {
      // type==='prev' is this case
      setCurrentPage((prev) => prev - 1);
    }
  };

  // used to calculate user percentile as soon as required data is fetched // ovo treba
  useEffect(() => {
    // check if the user has position on the leaderboard
    if (!leaderboardToppers?.position) {
      setUserPercentile(-1);
      if (currentSearchedAddress.length > 0 && isCustomResult)
        setShowNoresults(true);
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
                <p className={styles.leaderboard_heading}>Leaderboard</p>
              </div>
              <div className={styles.leaderboard_chiplist} style={{ flex: 1 }}>
                <ChipList
                  selected={duration}
                  handleChangeSelection={handleChangeSelection}
                  tags={["Last 7 Days", "Last 30 Days", "All time"]}
                />
              </div>
              <div style={{ flex: 0.4 }}>
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
                    <Avatar
                      address={
                        currentSearchedAddress.length > 0
                          ? currentSearchedAddress
                          : userAddress
                      }
                    />
                  ) : null}
                  <div className={styles.percentile_text_container}>
                    <p className={styles.percentile_text_normal}>
                      {currentSearchedAddress.length > 0 ? "He is" : "You are "}
                    </p>
                    <span className={styles.percentile_text_green}>
                      &nbsp;better than {userPercentile}%&nbsp;
                    </span>
                    <p className={styles.percentile_text_normal}>
                      of the other players
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.percentile_container}>
                  <p className={styles.percentile_text_normal}>
                    You werent active this week. ready to jump back in?
                  </p>
                  <Link href="/">
                    <p className={styles.percentile_text_link}>
                      Start your quest
                    </p>
                  </Link>
                </div>
              )
            ) : null}
            <Divider
              orientation="horizontal"
              variant="fullWidth"
              className={styles.divider}
            />

            {/* shows loader skeleton while data is still being fetched*/}

            {rankingdataloading ? <RankingSkeleton /> :

ranking ? (
  showNoresults ? (
                // {/* this will be displayed if searched user is not present in leaderboard or server returns 500*/}
                <div className={styles.no_result_container}>
                  <img
                    src="/visuals/animals/tiger.webp"
                    height={256}
                    width={254}
                    alt="error image"
                  />
                  <p className="pb-[1.5rem]">
                    No Results Found! Try a new search
                  </p>
                  <Divider
                    orientation="horizontal"
                    variant="fullWidth"
                    className={styles.divider}
                  />
                </div>
              ) : (
                <>
                  <RankingsTable
                    data={ranking}
                    selectedAddress={
                      currentSearchedAddress.length > 0
                        ? currentSearchedAddress
                        : hexToDecimal(userAddress)
                    }
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
                    setCustomResult={setCustomResult}
                  />
                  <Divider
                    orientation="horizontal"
                    variant="fullWidth"
                    className={styles.divider}
                  />
                </>
              )
            ) :    
            <div className={styles.no_result_container}>
            <p className="pb-[1.5rem] text-[1.5rem]">
              Something went wrong! Try again...
            </p>
            <Divider
              orientation="horizontal"
              variant="fullWidth"
              className={styles.divider}
            />
          </div>}
                  
            <div className={styles.leaderboard_topper_layout}>
              {leaderboardToppers
                ? isMobile
                  ? rankOrderMobile.map((position, index) => {
                      const item =
                        leaderboardToppers?.best_users?.[position - 1];
                      if (!item) return null;
                      return (
                        <Link
                          key={item?.address}
                          href={`/${decimalToHex(item.address)}`}
                        >
                          <RankCard
                            key={index}
                            name={item?.address}
                            experience={item?.xp}
                            trophy={item?.achievements}
                            position={position}
                          />
                        </Link>
                      );
                    })
                  : rankOrder.map((position, index) => {
                      const item =
                        leaderboardToppers?.best_users?.[position - 1];
                      if (!item) return null;
                      return (
                        <Link
                          key={item?.address}
                          href={`/${decimalToHex(item.address)}`}
                        >
                          <RankCard
                            key={index}
                            name={item?.address}
                            experience={item?.xp}
                            trophy={item?.achievements}
                            position={position}
                          />
                        </Link>
                      );
                    })
                : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
