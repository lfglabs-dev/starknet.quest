import React, { useContext, useEffect, useState } from "react";
import ChipList from "../components/UI/ChipList";
import Divider from "../components/UI/Divider";
import RankCards from "../components/UI/RankCards";
import ChevronRight from "../public/icons/ChevronRightIcon.svg";
import ChevronLeft from "../public/icons/ChevronLeftIcon.svg";
import BottomArrow from "../public/icons/dropdownArrow.svg";
import Image from "next/image";
import {
  fetchLeaderboardRankings,
  fetchLeaderboardToppers,
  getCompletedQuestsOfUser,
} from "../services/apiService";
import XpBadge from "../public/icons/xpBadge.svg";
import { calculatePercentile } from "../utils/numberService";
import Avatar from "../components/UI/avatar";
import styles from "../styles/leaderboard.module.css";
import { useAccount } from "@starknet-react/core";
import LeaderboardSkeleton from "../components/skeletons/leaderboardSkeleton";
import FeaturedQuest from "../components/UI/featured_banner/featuredQuest";
import { QuestsContext } from "../context/QuestsProvider";
import { useRouter } from "next/router";
import Searchbar from "../components/leaderboard/searchbar";
import RankingSkeleton from "../components/skeletons/rankingSkeleton";
import { minifyAddress } from "../utils/stringService";
import { getDomainFromAddress } from "../utils/domainService";
import { decimalToHex } from "../utils/feltService";
import { useDebounce } from "../hooks/useDebounce";

// declare types
type RankingData = {
  first_elt_position: number;
  ranking: { address: string; xp: number; achievements: number }[];
};

type LeaderboardToppersData = {
  weekly: {
    best_users: { address: string; xp: number; achievements: number }[];
    length: number;
    position?: number;
  };
  monthly: {
    best_users: { address: string; xp: number; achievements: number }[];
    length: number;
    position?: number;
  };
  all_time: {
    best_users: { address: string; xp: number; achievements: number }[];
    length: number;
    position?: number;
  };
};

type FormattedRankingProps = {
  address: string;
  xp: number;
  achievements: number;
  completedQuests?: number;
}[];

const sampleDomains = ["ayush.stark", "ayushtom.stark"];

// Simulated API function
function verifyDomain(domain: string, delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = sampleDomains.includes(domain);
      resolve(res);
    }, delay);
  });
}

// used to map the time frame to the api call
const timeFrameMap = {
  "Last 7 Days": "weekly",
  "Last 30 Days": "monthly",
  "All time": "all_time",
};

// page size limit
const PAGE_SIZE = [10, 15, 20];

// show leaderboard ranking table
const Rankings = (props: {
  data: {
    first_elt_position: number;
    ranking: { address: string; xp: number; achievements: number }[];
  };
  paginationLoading: boolean;
  setPaginationLoading: (_: boolean) => void;
  userAddress: string;
  searchedAddress: string;
}) => {
  // used to format the data to be displayed
  const [displayData, setDisplayData] = useState<FormattedRankingProps>([]);

  // make single digit numbers to double digit
  const addNumberPadding = (num: number) => {
    return num > 9 ? num : `0${num}`;
  };

  const {
    data,
    setPaginationLoading,
    paginationLoading,
    userAddress,
    searchedAddress,
  } = props;

  // this will run whenever the rankings are fetched and the data is updated
  useEffect(() => {
    if (!data) return;
    if (!(Object.keys(data).length > 0)) return;
    const res: FormattedRankingProps = data?.ranking;
    const makeCall = async () => {
      await Promise.all(
        await res?.map(async (item) => {
          // fetch completed quests and add to the display data
          const completedQuestsResponse = await getCompletedQuestsOfUser(
            item?.address
          );
          item.completedQuests = completedQuestsResponse?.length;

          // get the domain name from the address
          const hexAddress = decimalToHex(item.address);
          const domainName = await getDomainFromAddress(hexAddress);
          if (domainName.length > 0) {
            item.address = domainName;
          } else {
            item.address = minifyAddress(hexAddress);
          }
        })
      );
      setDisplayData(res);
      setPaginationLoading(false);
    };
    makeCall();
  }, [data]);

  return (
    <div className="flex flex-col gap-1">
      {paginationLoading ? (
        <RankingSkeleton />
      ) : (
        displayData?.map((item, index) => (
          <div
            key={item.address}
            className="grid grid-cols-2 px-4 py-2 items-center justify-center rounded-lg"
            style={{
              backgroundColor:
                item.address === userAddress || item.address === searchedAddress
                  ? "#101012"
                  : "transparent",
            }}
          >
            <div
              className="flex gap-2 md:gap-6 justify-between"
              style={{ flex: 0.1 }}
            >
              <div className="flex flex-1 max-w-[22px] items-center">
                <p className="text-white text-center">
                  {addNumberPadding(data.first_elt_position + index)}
                </p>
              </div>
              <div className="flex flex-1 gap-2 md:gap-6 items-center">
                <Avatar address={item.address} width="32" />
                <p className="text-white">{item.address}</p>
              </div>
            </div>
            <div className="flex flex-col w-full gap-1" style={{ flex: 0.9 }}>
              <div className="flex w-full gap-4 items-center justify-end">
                <Image src={XpBadge} priority width={35} height={35} />
                <p className="text-white text-center">{item.xp}</p>
              </div>
              <p className={styles.quests_text}>
                {item.completedQuests} Quests
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// this will contain the pagination arrows and page size limit controls
const ControlsDashboard = (props: {
  ranking: RankingData;
  handlePagination: (_: string) => void;
  rowsPerPage: number;
  setRowsPerPage: (_: number) => void;
  leaderboardToppers: LeaderboardToppersData;
  duration: string;
}) => {
  const {
    ranking,
    handlePagination,
    rowsPerPage,
    setRowsPerPage,
    leaderboardToppers,
    duration,
  } = props;
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="w-full flex flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        <p className={styles.rows_text}>Rows per page</p>
        <div
          className="relative flex justify-center items-center cursor-pointer"
          aria-selected={showMenu}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <div className="flex gap-1 items-center">
            <p>{rowsPerPage}</p>
            <Image src={BottomArrow} priority />
          </div>
          {showMenu ? (
            <div className={styles.walletMenu}>
              {PAGE_SIZE.map((item, index) => (
                <button
                  className={styles.menu_button}
                  key={index}
                  onClick={() => setRowsPerPage(item)}
                >
                  <p>{item}</p>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-row gap-4">
          <div
            className="cursor-pointer"
            onClick={() => {
              if (ranking.first_elt_position == 1) return;
              handlePagination("prev");
            }}
          >
            <Image
              src={ChevronLeft}
              priority
              style={{ fill: "red", stroke: "red" }}
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              if (
                ranking.first_elt_position + ranking.ranking.length >=
                leaderboardToppers[
                  timeFrameMap[
                    duration as keyof typeof timeFrameMap
                  ] as keyof typeof leaderboardToppers
                ]?.length
              )
                return;
              handlePagination("next");
            }}
          >
            <Image src={ChevronRight} priority />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Leaderboard() {
  const router = useRouter();
  const { address: userAddress } = useAccount();
  const { featuredQuest } = useContext(QuestsContext);

  const [duration, setDuration] = useState<string>("Last 7 Days");
  const [userPercentile, setUserPercentile] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchAddress = useDebounce<string>(searchQuery, 200);
  const [currentSearchedAddress, setCurrentSearchedAddress] =
    useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [ranking, setRanking] = useState<RankingData>({
    first_elt_position: 0,
    ranking: [],
  });
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

  const address = userAddress;

  // on user selecting duration
  const handleChangeSelection = (title: string) => {
    setDuration(title);
  };

  // on user typing
  const handleChange = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const checkIfValidAddress = async (address: string) => {
      const res = await verifyDomain(address);
      const suggestions = [];
      if (res) {
        suggestions.push(address);
        setSearchResults(suggestions);
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

  // fetch initial data on page load
  useEffect(() => {
    const makeCall = async () => {
      setLoading(true);
      const requestBody = {
        addr: address ? address : "",
        page_size: 10,
        shift: 0,
        start_timestamp: new Date().setDate(new Date().getDate() - 7),
        end_timestamp: new Date().getTime(),
      };

      const rankingData = await fetchLeaderboardRankings(requestBody);
      const topperData = await fetchLeaderboardToppers({
        addr: address ? address : "",
      });

      setRanking(rankingData);
      setLeaderboardToppers(topperData);
      setLoading(false);
    };

    makeCall();
  }, []);

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
    if (!address) return;
    const requestBody = {
      addr:
        currentSearchedAddress.length > 0 ? currentSearchedAddress : address,
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
  }, [rowsPerPage, currentPage, duration, currentSearchedAddress]);

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
    <div className="p-6 md:py-32 flex flex-col w-full justify-center items-center ">
      {loading ? (
        <div className="flex w-full mt-[12vh] md:mt-0 max-w-[1250px]">
          <LeaderboardSkeleton />
        </div>
      ) : (
        <>
          <div className="max-w-[1250px] flex w-full justify-center mt-[12vh] md:mt-0">
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
          <div className="flex flex-col rounded-lg bg-gray-300 w-full gap-6 px-2 md:px-4 py-7 max-w-[1250px]">
            <div className="flex flex-col md:flex-row w-full justify-between items-center gap-6">
              <div style={{ flex: 0.4 }}>
                <p className={styles.leaderboard_heading}>Leaderboard</p>
              </div>
              <div
                className="flex w-full items-center justify-center"
                style={{ flex: 1 }}
              >
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
                  }}
                />
              </div>
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
            <Divider />

            {/* this will be if searched user is not present in leaderboard or server returns 500 */}
            {ranking ? (
              <>
                <Rankings
                  data={ranking}
                  paginationLoading={paginationLoading}
                  setPaginationLoading={setPaginationLoading}
                  userAddress={address}
                  searchedAddress={currentSearchedAddress}
                />
                <ControlsDashboard
                  ranking={ranking}
                  handlePagination={handlePagination}
                  leaderboardToppers={leaderboardToppers}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  duration={duration}
                />
                <Divider />
              </>
            ) : (
              <div className="flex justify-center items-center">
                No results found!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaderboardToppers
                ? leaderboardToppers[
                    timeFrameMap[
                      duration as keyof typeof timeFrameMap
                    ] as keyof typeof leaderboardToppers
                  ]?.best_users?.map((item, index) => (
                    <RankCards
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
