"use client";

import React, { useEffect, useState } from "react";
import styles from "@styles/achievements.module.css";
import { useAccount } from "@starknet-react/core";
import { AchievementsDocument } from "../../types/backTypes";
import Achievement from "@components/achievements/achievement";
import { hexToDecimal } from "@utils/feltService";
import AchievementSkeleton from "@components/skeletons/achievementSkeleton";
import { useLocation } from "react-use";
import RefreshIcon from "@components/UI/iconsComponents/icons/refreshIcon";
import theme from "@styles/theme";
import {
  getUserAchievementByCategory,
  getUserAchievements,
  verifyUserAchievement,
} from "@services/apiService";
import Typography from "@components/UI/typography/typography";
import type { TEXT_TYPE } from "@constants/typography";

export default function Page() {
  const location = useLocation();
  const { address } = useAccount();
  const [userAchievements, setUserAchievements] = useState<
    AchievementsDocument[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAchievementsByAddress = async (address = "0") => {
    const achievements = await getUserAchievements(address);
    if (achievements as AchievementsDocument[]) {
      setUserAchievements(achievements as AchievementsDocument[]);
    }
  };

  useEffect(() => {
    // If a call was made with an address in the first second, the call with 0 address should be cancelled
    let shouldFetchWithZeroAddress = true;

    // Set a 1-second timer to allow time for address loading
    const timer = setTimeout(async () => {
      // If address isn't loaded after 1 second, make the API call with the zero address
      if (shouldFetchWithZeroAddress) {
        fetchAchievementsByAddress("0");
      }
    }, 1000);

    // If the address is loaded before the 1-second timer, make the API call with the loaded address
    if (address) {
      shouldFetchWithZeroAddress = false;
      clearTimeout(timer);
      fetchAchievementsByAddress(hexToDecimal(address));
    }
    // Clear the timer when component unmounts or dependencies change to prevent memory leaks
    return () => {
      clearTimeout(timer);
    };
  }, [address, location]);

  const validateAchievements = () => {
    const checkAchievements = async () => {
      const promises = userAchievements.map(
        async (achievementCategory, index) => {
          // If the achievement has a function to batch verifications we use it
          if (achievementCategory.category_override_verified_type) {
            const needsVerify = achievementCategory.achievements.filter(
              (achievement) => !achievement.completed
            );
            if (needsVerify.length > 0) {
              try {
                const data = await getUserAchievementByCategory({
                  category: achievementCategory.category_override_verified_type,
                  address: hexToDecimal(address),
                  categoryId: achievementCategory.category_id,
                });

                if (data?.achieved && data.achieved.length > 0) {
                  const newUserAchievements = [...userAchievements];
                  data.achieved.map((task) => {
                    const taskIndex = newUserAchievements[
                      index
                    ].achievements.findIndex((a) => a.id === task);
                    newUserAchievements[index].achievements[
                      taskIndex
                    ].completed = true;
                  });
                  setUserAchievements(newUserAchievements);
                }
              } catch (error) {
                console.error("Fetch error:", error);
              }
            }
          } else {
            // otherwise we check each achievement individually
            const achievementsPromises = achievementCategory.achievements.map(
              async (achievement, aIndex) => {
                if (!achievement.completed) {
                  try {
                    const data = await verifyUserAchievement({
                      verifyType: achievement.verify_type,
                      address: hexToDecimal(address),
                      achievementId: achievement.id,
                    });

                    if (data?.achieved) {
                      const newUserAchievements = [...userAchievements];
                      newUserAchievements[index].achievements[
                        aIndex
                      ].completed = true;
                      setUserAchievements(newUserAchievements);
                    }
                  } catch (error) {
                    console.error("Fetch error:", error);
                  }
                }
              }
            );
            await Promise.all(achievementsPromises);
          }
        }
      );
      setLoading(true);
      await Promise.all(promises);
      setLoading(false);
    };
    if (userAchievements.length === 0 || !address) return;
    checkAchievements();
  };

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <div className={styles.cards}>
            <div className={styles.headerContent}>
              <div className={styles.titleContent}>
                <Typography className={styles.title} type={TEXT_TYPE.H1}>Achievements</Typography>
                <div
                  className={styles.refreshButton}
                  onClick={() => validateAchievements()}
                >
                  <RefreshIcon
                    width="20"
                    color={theme.palette.background.default}
                  />
                  <div>Refresh data</div>
                </div>
              </div>
              <p className={styles.subtitle}>
                Complete achievements and grow your Starknet on-chain reputation
              </p>
            </div>
            {!loading && userAchievements.length > 0 ? (
              userAchievements.map(
                (achievementCategory: AchievementsDocument, index: number) => {
                  return (
                    <Achievement
                      achievements={achievementCategory}
                      key={achievementCategory.category_name}
                      index={index}
                    />
                  );
                }
              )
            ) : (
              <div className={styles.skeleton}>
                <AchievementSkeleton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
