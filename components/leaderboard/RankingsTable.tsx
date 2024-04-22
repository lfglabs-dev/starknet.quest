import React from "react";
import RankingSkeleton from "@components/skeletons/rankingSkeleton";
import { minifyAddress, minifyDomain } from "@utils/stringService";
import { getDomainFromAddress } from "@utils/domainService";
import { decimalToHex } from "@utils/feltService";
import Avatar from "@components/UI/avatar";
import { FunctionComponent, useEffect, useState } from "react";
import { getCompletedQuests } from "@services/apiService";
import styles from "@styles/leaderboard.module.css";
import { useMediaQuery } from "@mui/material";
import { isStarkDomain } from "starknetid.js/packages/core/dist/utils";
import Link from "next/link";
import { CDNImage } from "@components/cdn/image";
import { useAccount } from "@starknet-react/core";
import { TOP_50_TAB_STRING } from "@constants/common";
import Top50RankedUsers from "./Top50RankedUsers";

// show leaderboard ranking table
const RankingsTable: FunctionComponent<RankingProps> = ({
  data,
  duration,
  paginationLoading,
  setPaginationLoading,
  selectedAddress,
}) => {
  const { address: connectedUserAddress, isConnecting } = useAccount();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  // used to format the data to be displayed
  const [displayData, setDisplayData] = useState<FormattedRankingProps>([]);

  // make single digit numbers to double digit
  const addNumberPadding = (num: number) => {
    return num > 9 ? num : `0${num}`;
  };

  // this will run whenever the rankings are fetched and the data is updated
  useEffect(() => {
    if (!data) return;
    if (!(Object.keys(data).length > 0)) return;
    const res: FormattedRankingProps = data?.ranking;
    const makeCall = async () => {
      await Promise.all(
        await res?.map(async (item) => {
          // fetch completed quests and add to the display data
          const completedQuestsResponse = await getCompletedQuests(
            item?.address
          );
          item.completedQuests = completedQuestsResponse?.length;

          // get the domain name from the address
          const hexAddress = decimalToHex(item.address);
          const domainName = await getDomainFromAddress(hexAddress);
          if (domainName.length > 0) {
            item.displayName = domainName;
          } else {
            item.displayName = minifyAddress(hexAddress);
          }
        })
      );
      setDisplayData(res);
      setPaginationLoading(false);
    };
    makeCall();
  }, [data]);

  return (
    <div className={styles.ranking_container}>
      {paginationLoading ? (
        <RankingSkeleton />
      ) : duration === TOP_50_TAB_STRING ||
        (!isConnecting && !connectedUserAddress) ? (
        <Top50RankedUsers />
      ) : (
        displayData?.map((item, index) => {
          const isMyRank = index === 0 && item.address === connectedUserAddress; // According to api, first item should be connected user rank
          const itemRank = data.first_elt_position + index;
          return (
            <Link key={item.address} href={`/${decimalToHex(item.address)}`}>
              <div
                className={styles.ranking_table_row}
                style={{
                  backgroundColor:
                    selectedAddress === item.address || isMyRank
                      ? "black"
                      : hoveredIndex === index
                      ? "#1C1C1C"
                      : "transparent",
                }}
                onMouseOver={() => setHoveredIndex(index)}
              >
                <div className={styles.ranking_table_row_name_rank}>
                  <div className={styles.ranking_position_layout}>
                    <p className="text-white text-center">
                      {itemRank > 10000
                        ? "+10k"
                        : itemRank > 5000
                        ? "+5k"
                        : addNumberPadding(itemRank)}
                    </p>
                  </div>
                  <div className={styles.ranking_profile_layout}>
                    <Avatar address={item.address} width="32" />
                    <p
                      style={{
                        color:
                          selectedAddress === item.address || isMyRank
                            ? "#6AFFAF"
                            : "#ffffff",
                      }}
                    >
                      {isMobile &&
                      item &&
                      item.displayName &&
                      isStarkDomain(item.displayName)
                        ? minifyDomain(item.displayName)
                        : item.displayName}
                    </p>
                  </div>
                </div>
                <div className={styles.ranking_table_row_xp_quest}>
                  <div className={styles.ranking_points_layout}>
                    <CDNImage
                      src={"/icons/xpBadge.svg"}
                      priority
                      width={35}
                      height={35}
                      alt="xp badge"
                    />
                    <p className="text-white text-center">{item.xp}</p>
                  </div>
                  <p className={styles.quests_text}>
                    {item.completedQuests} Quests
                  </p>
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default RankingsTable;
