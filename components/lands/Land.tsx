import React, { useEffect, useState } from "react";
import { Scene } from "./Scene";
import {
  checkAssetInLands,
  checkAssetInSq,
  memberSince,
} from "../../utils/sortNfts";
import styles from "../../styles/profile.module.css";
import Button from "../UI/button";
import { NFTCounters, NFTData } from "../../types/nft";
import { LandsNFTs } from "../../constants/nft";

type LandProps = {
  address: string;
  isOwner: boolean;
  setNFTCounter: (nb: number) => void;
  isMobile: boolean;
  setSinceDate: (s: string | null) => void;
  setShowTooltip: (show: boolean) => void;
  setTooltipData: (data: number) => void;
};

export const Land = ({
  address,
  isOwner,
  setNFTCounter,
  isMobile,
  setSinceDate,
}: LandProps) => {
  const [hasNFTs, setHasNFTs] = useState<boolean>(false);
  const [userNft, setUserNft] = useState<NFTData>();
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

  const filterAssets = (assets: StarkscanNftProps[]) => {
    let sinceDate = 0;
    const finalNFTCounters: NFTCounters = {
      totalNFTs: 0,
      braavosCounter: 0,
      argentxCounter: 0,
      starkFighterLevel: 0,
    };
    const finalNFTFlags: boolean[] = [];

    const braavosTarget = new Set(LandsNFTs.braavos.nft_names as string[]);
    const argentxTarget = new Set(LandsNFTs.argentx.nft_names as string[]);

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (asset.minted_at_timestamp < sinceDate || sinceDate === 0)
        sinceDate = asset.minted_at_timestamp;
      checkAssetInLands(
        asset,
        braavosTarget,
        LandsNFTs.braavos.contract_address,
        "braavos",
        finalNFTCounters
      );
      checkAssetInLands(
        asset,
        argentxTarget,
        LandsNFTs.argentx.contract_address,
        "argentx",
        finalNFTCounters
      );
      checkAssetInSq(asset, finalNFTCounters, finalNFTFlags);
    }

    setUserNft({
      counters: finalNFTCounters,
      flags: finalNFTFlags,
    });
    if (finalNFTCounters.totalNFTs > 0) setHasNFTs(true);
    else setHasNFTs(false);
    setIsReady(true);
    setNFTCounter(finalNFTCounters.totalNFTs);
    setSinceDate(memberSince(sinceDate));
    console.log("finalNFTs", {
      counters: finalNFTCounters,
      flags: finalNFTFlags,
    });
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          zIndex: "0",
          touchAction: "none",
          overflow: "hidden",
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
