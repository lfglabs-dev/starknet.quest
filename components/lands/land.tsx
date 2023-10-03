import React, { useEffect, useState } from "react";
import { Scene } from "./scene";
import { memberSince } from "../../utils/profile";
import styles from "../../styles/profile.module.css";
import landStyles from "../../styles/components/land.module.css";
import Button from "../UI/button";
import { SoloBuildings, StarkFighterBuildings } from "../../constants/nft";
import { AchievementsDocument } from "../../types/backTypes";

type LandProps = {
  address: string;
  isOwner: boolean;
  isMobile: boolean;
  setSinceDate: (date: string | null) => void;
  setAchievements: (achievements: BuildingsInfo[]) => void;
  setSoloBuildings: (buildings: BuildingsInfo[]) => void;
};

export const Land = ({
  address,
  isOwner,
  isMobile,
  setSinceDate,
  setAchievements,
  setSoloBuildings,
}: LandProps) => {
  const [userNft, setUserNft] = useState<BuildingsInfo[]>();
  const [hasNFTs, setHasNFTs] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      retrieveAssets(
        `https://${
          process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "api-testnet" : "api"
        }.starkscan.co/api/v0/nfts?owner_address=${address}`
      ).then((data) => {
        filterAssets(data.data);
      });
    }
  }, [address]);

  // Retrieve assets from Starkscan API
  const retrieveAssets = async (
    url: string,
    accumulatedAssets: StarkscanNftProps[] = []
  ): Promise<StarkscanApiResult> => {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.NEXT_PUBLIC_STARKSCAN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const assets = [...accumulatedAssets, ...data.data];
        if (data.next_url) {
          return retrieveAssets(data.next_url, assets);
        } else {
          return {
            data: assets,
          };
        }
      });
  };

  // Fetch achievements from database and add building id from highest achievement level
  const getBuildingsFromAchievements = async (filteredAssets: number[]) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/achievements/fetch?addr=${address}`
      );
      const results: AchievementsDocument[] = await response.json();
      if (results) {
        results.forEach((result: AchievementsDocument) => {
          for (let i = result.achievements.length - 1; i >= 0; i--) {
            if (result.achievements[i].completed) {
              filteredAssets.push(result.achievements[i].id);
              if (result.category_type === "levels") break;
            }
          }
        });
      }
    } catch (error) {
      console.error("An error occurred while fetching achievements", error);
    }
  };

  // Fetch buildings info (name, desc, img) from database
  const getBuildingsInfo = async (filteredAssets: number[]) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_LINK
        }/achievements/fetch_buildings?ids=${filteredAssets.join(",")}`
      );
      const results: BuildingsInfo[] = await response.json();
      if (results && results.length > 0) {
        setUserNft(results);
        setHasNFTs(true);
        setSoloBuildings(results.filter((x) => x.id >= 64000));
        setAchievements(results.filter((x) => x.id < 64000));
      } else setHasNFTs(false);
    } catch (error) {
      console.error("An error occurred while fetching buildings info", error);
    }
  };

  // Filter assets received from Starkscan API & filter solo buildings represented on the land
  const filterAssets = async (assets: StarkscanNftProps[]) => {
    const filteredAssets: number[] = [];
    const starkFighter: number[] = [];
    let sinceDate = 0;

    assets.forEach((asset: StarkscanNftProps) => {
      if (asset.minted_at_timestamp < sinceDate || sinceDate === 0)
        sinceDate = asset.minted_at_timestamp;

      if (
        asset.contract_address === process.env.NEXT_PUBLIC_QUEST_NFT_CONTRACT
      ) {
        if (asset.name && Object.values(SoloBuildings).includes(asset.name)) {
          filteredAssets.push(
            SoloBuildings[asset.name as keyof typeof SoloBuildings]
          );
        }
        if (
          asset.name &&
          Object.values(StarkFighterBuildings).includes(
            asset.name.toLowerCase()
          )
        ) {
          starkFighter.push(
            StarkFighterBuildings[
              asset.name.toLowerCase() as keyof typeof StarkFighterBuildings
            ]
          );
        }
      }
    });
    // get starkfighter highest level
    if (starkFighter.length > 0) {
      const highestValue = Math.max(
        ...starkFighter.filter((x) => x >= 64005 && x <= 64007)
      );
      filteredAssets.push(highestValue);
    }

    await getBuildingsFromAchievements(filteredAssets);
    await getBuildingsInfo(filteredAssets);

    setIsReady(true);
    setSinceDate(memberSince(sinceDate));
  };

  return (
    <div className={landStyles.landContainer}>
      {isReady ? (
        userNft && hasNFTs ? (
          <Scene address={address} userNft={userNft} isMobile={isMobile} />
        ) : (
          <div className={landStyles.error}>
            <h2 className={`${styles.notFound} ${styles.name} mb-5`}>
              {isOwner ? "You have" : "User has"} not fulfilled any achievement
              yet
            </h2>
            {isOwner ? (
              <div className="text-background ml-5 mr-5">
                <Button onClick={() => window.open("https://starknet.quest")}>
                  Start Achievements
                </Button>
              </div>
            ) : null}
          </div>
        )
      ) : (
        <h2 className={`${styles.name} ${styles.loading}`}>Loading</h2>
      )}
    </div>
  );
};
