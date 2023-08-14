import React, { useEffect, useState } from "react";
import { Scene } from "./Scene";
import { checkAssetInLands, checkAssetInSq } from "../../utils/sortNfts";
import styles from "../../styles/profile.module.css";
import Button from "../UI/button";
import { NFTCounters, NFTData } from "../../types/nft";
import { LandsNFTs } from "../../constants/nft";

type LandProps = {
  address: string;
  isOwner: boolean;
  setNFTCounter: (nb: number) => void;
};

export const Land = ({ address, isOwner, setNFTCounter }: LandProps) => {
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
            <Scene address={address} userNft={userNft} />
          ) : (
            <div
              className={`h-screen flex justify-center items-center flex-col`}
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
