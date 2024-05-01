import {
  LeaderboardRankingParams,
  fetchLeaderboardRankings,
} from "@services/apiService";
import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/leaderboard.module.css";
import { useMediaQuery } from "@mui/material";
import { decimalToHex } from "@utils/feltService";
import { rankOrder, rankOrderMobile } from "@constants/common";
import Link from "next/link";
import RankCard from "./RankCard";

function Top3RankedUsers({
  leaderboardToppers,
}: {
  leaderboardToppers: LeaderboardToppersData;
}) {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <div className={styles.leaderboard_topper_layout}>
      {leaderboardToppers
        ? isMobile
          ? rankOrderMobile.map((position, index) => {
              const item = leaderboardToppers?.best_users?.[position - 1];
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
              const item = leaderboardToppers?.best_users?.[position - 1];
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
  );
}

export default Top3RankedUsers;
