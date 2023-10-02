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
    setHasChecked(false);
    setUserAchievements([]);
  }, [location, address]);

  useEffect(() => {
    // If a call was made with an address in the first second, the call with 0 address should be cancelled
    let shouldFetchWithZeroAddress = true;

    // Set a 1-second timer to allow time for address loading
    const timer = setTimeout(() => {
      // If address isn't loaded after 1 second, make the API call with the zero address
      if (shouldFetchWithZeroAddress) {
        fetch(`${process.env.NEXT_PUBLIC_API_LINK}/achievements/fetch?addr=0`)
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
        `${
          process.env.NEXT_PUBLIC_API_LINK
        }/achievements/fetch?addr=${hexToDecimal(address)}`
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
    };
  }, [hasChecked, address]);

  // Map through user achievements and check if any are completed
  useEffect(() => {
    if (userAchievements.length > 0 && !hasChecked && address) {
      const promises: Promise<void>[] = [];
      userAchievements.forEach((achievementCategory, index) => {
        achievementCategory.achievements.forEach((achievement, aIndex) => {
          if (!achievement.completed) {
            const fetchPromise = fetch(
              `${process.env.NEXT_PUBLIC_API_LINK}/achievements/verify_${
                achievement.verify_type
              }?addr=${hexToDecimal(address)}&id=${achievement.id}`
            )
              .then((response) => response.json())
              .then((data: CompletedDocument) => {
                if (data?.achieved) {
                  const newUserAchievements = [...userAchievements];
                  newUserAchievements[index].achievements[aIndex].completed =
                    true;
                  setUserAchievements(newUserAchievements);
                }
              });
            promises.push(fetchPromise);
          }
        });
      });
      // Wait for all promises to resolve before setting hasChecked to true
      Promise.all(promises).then(() => {
        setHasChecked(true);
      });
    }
  }, [userAchievements.length, hasChecked]);

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Achievements</h1>
          <p className={styles.subtitle}>
            Complete achievements and grow your Starknet on-chain reputation
          </p>
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.cards}>
            {userAchievements.length > 0 ? (
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
              <AchievementSkeleton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
