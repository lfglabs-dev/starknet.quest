import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "../styles/achievements.module.css";
import { useAccount } from "@starknet-react/core";
import {
  AchievementsDocument,
  CompletedDocument,
  QueryError,
} from "../types/backTypes";
import Achievement from "../components/achievements/achievement";
import { hexToDecimal } from "../utils/feltService";
import AchievementSkeleton from "../components/skeletons/achievementSkeleton";
import { useLocation } from "react-use";

const Achievements: NextPage = () => {
  const location = useLocation();
  const { address } = useAccount();
  const [userAchievements, setUserAchievements] = useState<
    AchievementsDocument[]
  >([]);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  useEffect(() => {
    // If a call was made with an address in the first second, the call with 0 address should be cancelled
    let shouldFetchWithZeroAddress = true;

    // Set a 1-second timer to allow time for address loading
    const timer = setTimeout(() => {
      // If address isn't loaded after 1 second, make the API call with the zero address
      if (shouldFetchWithZeroAddress) {
        fetch(`${"https://api.starknet.quest"}/achievements/fetch?addr=0`)
          .then((response) => response.json())
          .then((data: AchievementsDocument[] | QueryError) => {
            if (data as AchievementsDocument[])
              setUserAchievements(data as AchievementsDocument[]);
          });
      }
    }, 1000);

    // If the address is loaded before the 1-second timer, make the API call with the loaded address
    if (address) {
      shouldFetchWithZeroAddress = false;
      clearTimeout(timer);
      fetch(
        `${"https://api.starknet.quest"}/achievements/fetch?addr=${hexToDecimal(
          address
        )}`
      )
        .then((response) => response.json())
        .then((data: AchievementsDocument[] | QueryError) => {
          if (data as AchievementsDocument[])
            setUserAchievements(data as AchievementsDocument[]);
        });
    }
    // Clear the timer when component unmounts or dependencies change to prevent memory leaks
    return () => {
      clearTimeout(timer);
      setHasChecked(false);
    };
  }, [address, location]);

  // Map through user achievements and check if any are completed
  useEffect(() => {
    if (userAchievements.length > 0 && !hasChecked && address) {
      const checkAchievements = async () => {
        const promises = userAchievements.map(
          async (achievementCategory, index) => {
            const achievementsPromises = achievementCategory.achievements.map(
              async (achievement, aIndex) => {
                if (!achievement.completed) {
                  try {
                    const response = await fetch(
                      `${"https://api.starknet.quest"}/achievements/verify_${
                        achievement.verify_type
                      }?addr=${hexToDecimal(address)}&id=${achievement.id}`
                    );
                    const data: CompletedDocument = await response.json();

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
        );

        await Promise.all(promises);
        setHasChecked(true);
      };
      checkAchievements();
    }
  }, [userAchievements.length, hasChecked, address]);

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Achievements</h1>
          <p className={styles.subtitle}>
            Complete achievements and grow your Starknet on-chain reputation
          </p>
        </div>
        {userAchievements.length > 0 ? (
          <div className={styles.cardWrapper}>
            <div className={styles.cards}>
              {userAchievements.map(
                (achievementCategory: AchievementsDocument, index: number) => {
                  return (
                    <Achievement
                      achievements={achievementCategory}
                      key={achievementCategory.category_name}
                      index={index}
                    />
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <AchievementSkeleton />
        )}
      </div>
    </div>
  );
};

export default Achievements;
