import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/profile.module.css";
import { useRouter } from "next/router";
import { isHexString } from "../utils/stringService";
import { useAccount } from "@starknet-react/core";
import SocialMediaActions from "../components/UI/actions/socialmediaActions";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import CopiedIcon from "../components/UI/iconsComponents/icons/copiedIcon";
import { Divider, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { decimalToHex, hexToDecimal } from "../utils/feltService";
import StarknetIcon from "../components/UI/iconsComponents/icons/starknetIcon";
import NftCard from "../components/UI/nftCard";
import { minifyAddress } from "../utils/stringService";
import Button from "../components/UI/button";
import PieChart from "../components/UI/pieChart";

const AddressOrDomain: NextPage = () => {
  const router = useRouter();
  const { addressOrDomain } = router.query;
  const { address, connector } = useAccount();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [initProfile, setInitProfile] = useState(false);
  const [identity, setIdentity] = useState<Identity>();
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [active, setActive] = useState(0);
  const dynamicRoute = useRouter().asPath;
  const [userNft, setUserNft] = useState<AspectNftProps[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [unusedAssets, setUnusedAssets] = useState<AspectNftProps[]>([]);
  const isBraavosWallet = connector && connector.id() === "braavos";

  // Filtered NFTs
  const NFTContracts = [
    hexToDecimal(process.env.NEXT_PUBLIC_QUEST_NFT_CONTRACT),
    hexToDecimal(process.env.NEXT_PUBLIC_XPLORER_NFT_CONTRACT),
    hexToDecimal(process.env.NEXT_PUBLIC_BRAAVOSSHIELD_NFT_CONTRACT),
    hexToDecimal(process.env.NEXT_PUBLIC_BRAAVOS_JOURNEY_NFT_CONTRACT),
  ];

  useEffect(() => setNotFound(false), [dynamicRoute]);

  useEffect(() => {
    setInitProfile(false);
  }, [router]);

  useEffect(() => {
    if (!address) setIsOwner(false);
  }, [address]);

  useEffect(() => {
    if (
      typeof addressOrDomain === "string" &&
      addressOrDomain?.toString().toLowerCase().endsWith(".stark")
    ) {
      starknetIdNavigator
        ?.getStarknetId(addressOrDomain)
        .then((id) => {
          getIdentityData(id).then((data: Identity) => {
            if (data.error) {
              setNotFound(true);
              return;
            }
            setIdentity({
              ...data,
              id: id.toString(),
            });
            if (hexToDecimal(address) === data.addr) setIsOwner(true);
            setInitProfile(true);
          });
        })
        .catch(() => {
          return;
        });
    } else if (
      typeof addressOrDomain === "string" &&
      isHexString(addressOrDomain)
    ) {
      starknetIdNavigator
        ?.getStarkName(hexToDecimal(addressOrDomain))
        .then((name) => {
          if (name) {
            starknetIdNavigator
              ?.getStarknetId(name)
              .then((id) => {
                getIdentityData(id).then((data: Identity) => {
                  if (data.error) return;
                  setIdentity({
                    ...data,
                    id: id.toString(),
                  });
                  if (hexToDecimal(address) === data.addr) setIsOwner(true);
                  setInitProfile(true);
                });
              })
              .catch(() => {
                return;
              });
          } else {
            setIdentity({
              id: "0",
              addr: hexToDecimal(addressOrDomain),
              domain: minifyAddress(addressOrDomain),
              is_owner_main: false,
            });
            setIsOwner(false);
            setInitProfile(true);
          }
        });
    } else {
      setNotFound(true);
    }
  }, [addressOrDomain, address]);

  useEffect(() => {
    if (identity) {
      retrieveAssets(
        `https://${
          process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "api-testnet" : "api"
        }.aspect.co/api/v0/assets?owner_address=${decimalToHex(identity.addr)}`
      ).then((data) => {
        setUserNft(data.assets);
        setNextUrl(data.next_url);
        setUnusedAssets(data.remainder ?? []);
      });
    }
  }, [identity, addressOrDomain, address]);

  const getIdentityData = async (id: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/id_to_data?id=${id}`
    );
    return response.json();
  };

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(decimalToHex(identity?.addr));
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const retrieveAssets = async (
    url: string,
    accumulatedAssets: AspectNftProps[] = []
  ): Promise<AspectApiResult> => {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${
          process.env.NEXT_PUBLIC_IS_TESTNET === "true"
            ? process.env.NEXT_PUBLIC_ASPECT_TESTNET
            : process.env.NEXT_PUBLIC_ASPECT_MAINNET
        }`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filteredAssets = filterAssets(data.assets);
        const assets = [...accumulatedAssets, ...filteredAssets];

        if (assets.length < 8 && data.next_url) {
          return retrieveAssets(data.next_url, assets);
        } else if (assets.length > 8) {
          // Split and save results
          const { res, remainder } = splitAssets(assets);
          return {
            assets: res,
            next_url: data.next_url ?? null,
            remainder,
          };
        } else {
          return {
            assets: assets,
            next_url: data.next_url,
          };
        }
      });
  };

  const filterAssets = (assets: AspectNftProps[]) => {
    return assets.filter((obj) =>
      NFTContracts.includes(hexToDecimal(obj.contract_address))
    );
  };

  const splitAssets = (
    assets: AspectNftProps[]
  ): { res: AspectNftProps[]; remainder: AspectNftProps[] } => {
    const modulo = assets.length % 8;
    const res = assets.slice(0, assets.length - modulo);
    const remainder = assets.slice(assets.length - modulo);
    return { res, remainder };
  };

  const loadMore = () => {
    if (unusedAssets.length > 0 && unusedAssets.length < 8) {
      if (nextUrl) {
        // fetch more assets from API
        retrieveAssets(nextUrl, unusedAssets).then((data) => {
          setUserNft((prev) => [...(prev as AspectNftProps[]), ...data.assets]);
          setNextUrl(data.next_url);
          setUnusedAssets(data.remainder ?? []);
        });
      } else {
        // show unused assets
        setUserNft((prev) => [...(prev as AspectNftProps[]), ...unusedAssets]);
        setUnusedAssets([]);
      }
    } else {
      const { res, remainder } = splitAssets(unusedAssets);
      setUserNft((prev) => [...(prev as AspectNftProps[]), ...res]);
      setUnusedAssets(remainder);
    }
  };

  if (notFound) {
    return (
      <div
        className={`h-screen flex justify-center items-center ${styles.name}`}
      >
        <h2 className={styles.notFound}>Profile not found</h2>
      </div>
    );
  }

  return initProfile && identity ? (
    <>
      <div className={styles.screen}>
        <div className={styles.profileContainer}>
          <div className={styles.profilePictureContainer}>
            <div className={styles.profilePicture}>
              <img
                width={"350px"}
                src={`https://www.starknet.id/api/identicons/${identity?.id}`}
                alt="starknet.id avatar"
                style={{ maxWidth: "150%" }}
              />
            </div>
            {/* We do not enable the profile pic change atm */}
            {/* <Tooltip title="Change profile picture" arrow>
              <div className={styles.cameraIcon}>
                <CameraAlt
                  className={styles.cameraAlt}
                  onClick={() => console.log("changing pfp")}
                />
              </div>
            </Tooltip> */}
          </div>
          <Divider variant="middle" orientation="vertical" />
          <div className="flex flex-col flex-start gap-3">
            <div className={styles.name}>{identity?.domain}</div>
            <div className={styles.starknetInfo}>
              <StarknetIcon width="32px" color="" />
              <div className={styles.address}>
                {typeof addressOrDomain === "string" &&
                isHexString(addressOrDomain)
                  ? minifyAddress(addressOrDomain)
                  : minifyAddress(decimalToHex(identity?.addr))}
              </div>

              <div className="cursor-pointer">
                {!copied ? (
                  <Tooltip title="Copy" arrow>
                    <ContentCopy
                      className={styles.contentCopy}
                      onClick={() => copyToClipboard()}
                    />
                  </Tooltip>
                ) : (
                  <CopiedIcon color="#6affaf" width="25" />
                )}
              </div>
            </div>
            <div className="flex lg:justify-start justify-center lg:items-start items-center">
              <SocialMediaActions
                domain={identity?.domain}
                isOwner={isOwner}
                tokenId={identity?.id}
              />
            </div>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.menu}>
            <div className={styles.menuTitle}>
              {/* <p
                  className={
                    active === 1 ? `${styles.active}` : `${styles.inactive}`
                  }
                  onClick={() => setActive(1)}
                >
                  My analytics
                </p>
              ) */}
              <p
                className={
                  active === 0 ? `${styles.active}` : `${styles.inactive}`
                }
                onClick={() => setActive(0)}
              >
                Starknet Achievements
              </p>
            </div>
            {!active ? (
              <>
                {isOwner && isBraavosWallet ? (
                  <div className={styles.pieChart}>
                    <PieChart />
                  </div>
                ) : null}
                <div className={styles.content}>
                  {userNft && userNft.length ? (
                    userNft.map((nft, index) => {
                      return (
                        <NftCard
                          key={index}
                          image={nft.image_uri as string}
                          title={nft.name as string}
                          url={nft.aspect_link as string}
                        />
                      );
                    })
                  ) : (
                    <p>No Starknet achievements yet, start some quests !</p>
                  )}
                </div>
                {nextUrl || unusedAssets.length > 0 ? (
                  <div className="text-background ml-5 mr-5 flex justify-center items-center flex-col">
                    <Button onClick={() => loadMore()}>Load More</Button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className={`h-screen flex justify-center items-center ${styles.name}`}>
      <h2>Loading</h2>
    </div>
  );
};

export default AddressOrDomain;
