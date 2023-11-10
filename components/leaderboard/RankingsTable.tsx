import React from "react";
import RankingSkeleton from "../skeletons/rankingSkeleton";
import { minifyAddress } from "../../utils/stringService";
import { getDomainFromAddress } from "../../utils/domainService";
import { decimalToHex } from "../../utils/feltService";
import Avatar from "../UI/avatar";
import XpBadge from "../../public/icons/xpBadge.svg";
import { FunctionComponent, useEffect, useState } from "react";
import { getCompletedQuestsOfUser } from "../../services/apiService";
import styles from "../../styles/leaderboard.module.css";
import Image from "next/image";

// show leaderboard ranking table
const RankingsTable: FunctionComponent<RankingProps> = ({
  data,
  paginationLoading,
  setPaginationLoading,
  selectedAddress,
}) => {
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
          const completedQuestsResponse = await getCompletedQuestsOfUser(
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
      ) : (
        displayData?.map((item, index) => (
          <div
            key={item.address}
            className={styles.ranking_table_row}
            style={{
              backgroundColor:
                selectedAddress === item.address ? "black" : "inherit",
            }}
          >
            <div className={styles.ranking_table_row_name_rank}>
              <div className={styles.ranking_position_layout}>
                <p className="text-white text-center">
                  {addNumberPadding(data.first_elt_position + index)}
                </p>
              </div>
              <div className={styles.ranking_profile_layout}>
                <Avatar address={item.address} width="32" />
                <p
                  style={{
                    color:
                      selectedAddress === item.address ? "#6AFFAF" : "#ffffff",
                  }}
                >
                  {item.displayName}
                </p>
              </div>
            </div>
            <div className={styles.ranking_table_row_xp_quest}>
              <div className={styles.ranking_points_layout}>
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

export default RankingsTable;
