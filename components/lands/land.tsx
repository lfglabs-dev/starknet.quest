import React, { useEffect, useState } from "react";
import { Scene } from "./scene";
import { memberSince } from "../../utils/profile";
import styles from "../../styles/profile.module.css";
import Button from "../UI/button";
import { soloBuildings, starkFighterBuildings } from "../../constants/nft";

type LandProps = {
  address: string;
  isOwner: boolean;
  isMobile: boolean;
  setSinceDate: (s: string | null) => void;
  setTotalNfts: (nb: number) => void;
  setAchievementCount: (n: number) => void;
  hasDomain: boolean;
};

export const Land = ({
  address,
  isOwner,
  isMobile,
  setSinceDate,
  setTotalNfts,
  setAchievementCount,
  hasDomain,
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
        console.log("data", data);
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
    let count = 0;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/achievements/fetch?addr=${address}`
      );
      const results: UserAchievements[] = await response.json();

      if (results) {
        results.forEach((result: UserAchievements) => {
          for (let i = result.achievements.length - 1; i >= 0; i--) {
            if (result.achievements[i].completed) {
              filteredAssets.push(result.achievements[i].id);
              if (i === 2) count++;
              break;
            }
          }
        });
      }
      setAchievementCount(count);
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
      if (results) {
        setUserNft(results);
        setHasNFTs(true);
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
    let nftCounter = 0;

    assets.forEach((asset: StarkscanNftProps) => {
      if (asset.contract_address === process.env.NEXT_PUBLIC_QUEST_NFT_CONTRACT)
        nftCounter++;
      if (asset.minted_at_timestamp < sinceDate || sinceDate === 0)
        sinceDate = asset.minted_at_timestamp;

      if (asset.name && soloBuildings[asset.name]) {
        filteredAssets.push(soloBuildings[asset.name]);
      }
      if (asset.name && starkFighterBuildings[asset.name]) {
        starkFighter.push(starkFighterBuildings[asset.name]);
      }
    });
    // get starkfighter highest level
    const highestValue = Math.max(
      ...starkFighter.filter((x) => x >= 64005 && x <= 64007)
    );
    filteredAssets.push(highestValue);
    if (hasDomain) filteredAssets.push(64000); // add starknetid building if user has a .stark domain

    await getBuildingsFromAchievements(filteredAssets);
    await getBuildingsInfo(filteredAssets);

    console.log("filtered assets", filteredAssets);

    setIsReady(true);
    setTotalNfts(nftCounter);
    setSinceDate(memberSince(sinceDate));
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        zIndex: 0,
        touchAction: "none",
        overflow: "hidden",
        backgroundImage: `url("/land/textures/SID_Background_SpaceLoop.gif")`,
        backgroundRepeat: "repeat",
      }}
    >
      {isReady ? (
        userNft && hasNFTs ? (
          <Scene address={address} userNft={userNft} isMobile={isMobile} />
        ) : (
          <div
            className={`md:h-screen flex justify-center items-center flex-col mt-[100px] mx-5 md:mr-[250px] md:ml-0 md:mt-0`}
          >
            <h2 className={`${styles.notFound} ${styles.name} mb-5`}>
              {isOwner ? "You have" : "User has"} not fulfilled any quest yet
            </h2>
            {isOwner ? (
              <div className="text-background ml-5 mr-5">
                <Button onClick={() => window.open("https://starknet.quest")}>
                  Begin
                </Button>
              </div>
            ) : null}
          </div>
        )
      ) : (
        <h2 className={`${styles.notFound} ${styles.name} mb-5`}>Loading</h2>
      )}
    </div>
  );
};
