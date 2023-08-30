import React, { useEffect, useState } from "react";
import { Scene } from "./Scene";
import { memberSince } from "../../utils/sortNfts";
import styles from "../../styles/profile.module.css";
import Button from "../UI/button";
import { soloBuildings, starkFighterBuildings } from "../../constants/nft";

type LandProps = {
  address: string;
  isOwner: boolean;
  setNFTCounter: (nb: number) => void;
  isMobile: boolean;
  setSinceDate: (s: string | null) => void;
  setShowTooltip: (show: boolean) => void;
  setTooltipData: (data: number) => void;
  hasDomain: boolean;
};

export const Land = ({
  address,
  isOwner,
  setNFTCounter,
  isMobile,
  setSinceDate,
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

  const getBuildingsFromAchievements = async (filteredAssets: number[]) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/achievements/fetch?addr=${address}`
      );
      const results: UserAchievements[] = await response.json();
      console.log("results", results);

      if (results) {
        results.forEach((result: UserAchievements) => {
          console.log("result", result);
          for (let i = 0; i < result.achievements.length; i++) {
            if (!result.achievements[i].completed) {
              if (i > 0) filteredAssets.push(result.achievements[i - 1].id);
              break;
            }
          }
        });
      }
    } catch (error) {
      console.error("An error occurred while fetching achievements", error);
    }
  };

  const getBuildingsInfo = async (filteredAssets: number[]) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_LINK
        }/achievements/fetch_buildings?ids=${filteredAssets.join(",")}`
      );
      const results: BuildingsInfo[] = await response.json();
      console.log("results", results);
      if (results) setUserNft(results);
    } catch (error) {
      console.error("An error occurred while fetching buildings info", error);
    }
  };

  const filterAssets = async (assets: StarkscanNftProps[]) => {
    console.log("assets", assets);
    const filteredAssets: number[] = [];
    const starkFighter: number[] = [];
    let sinceDate = 0;

    assets.forEach((asset: StarkscanNftProps) => {
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

    if (filteredAssets.length > 0) setHasNFTs(true);
    else setHasNFTs(false);
    setIsReady(true);
    setNFTCounter(filteredAssets.length);
    setSinceDate(memberSince(sinceDate));
  };

  return (
    <>
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
    </>
  );
};
