import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/profile.module.css";
import { useRouter } from "next/router";
import { isHexString } from "../utils/stringService";
import { useAccount, useConnectors } from "@starknet-react/core";
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
  const { address } = useAccount();
  const { connectors } = useConnectors();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [initProfile, setInitProfile] = useState(false);
  const [identity, setIdentity] = useState<Identity>();
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [active, setActive] = useState(0);
  const dynamicRoute = useRouter().asPath;
  const [userNft, setUserNft] = useState<AspectNftProps[]>();
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const isBraavosWallet =
    connectors &&
    connectors.filter((wallet: any) => {
      return (
        wallet._wallet &&
        wallet._wallet.id === "braavos" &&
        wallet._wallet.isConnected === true
      );
    }).length > 0;

  console.log("isBraavosWallet", isBraavosWallet);

  // Filtered NFTs
  const NFTContracts = [
    process.env.NEXT_PUBLIC_QUEST_NFT_CONTRACT,
    process.env.NEXT_PUBLIC_XPLORER_NFT_CONTRACT,
    process.env.NEXT_PUBLIC_BRAAVOSSHIELD_NFT_CONTRACT,
    process.env.NEXT_PUBLIC_BRAAVOS_JOURNEY_NFT_CONTRACT,
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
        setUserNft(filterAssets(data.assets));
        setNextUrl(data.next_url);
      });
    }
  }, [identity, addressOrDomain, address]);

  const getIdentityData = async (id: number) => {
    const response = await fetch(
      `https://${
        process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? `goerli.` : ``
      }app.starknet.id/api/indexer/id_to_data?id=${id}`
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

  const retrieveAssets = async (url: string) => {
    const data = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${
          process.env.NEXT_PUBLIC_IS_TESTNET === "true"
            ? process.env.NEXT_PUBLIC_ASPECT_TESTNET
            : process.env.NEXT_PUBLIC_ASPECT_MAINNET
        }`,
      },
    });
    return data.json();
  };

  const filterAssets = (assets: AspectNftProps[]) => {
    return assets.filter((obj) => NFTContracts.includes(obj.contract_address));
  };

  const loadMore = () => {
    if (nextUrl)
      retrieveAssets(nextUrl).then((data) => {
        setUserNft((prev) => [
          ...(prev as AspectNftProps[]),
          ...filterAssets(data.assets),
        ]);
        setNextUrl(data.next_url);
      });
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
              {isOwner && isBraavosWallet ? (
                <p
                  className={
                    active === 1 ? `${styles.active}` : `${styles.inactive}`
                  }
                  onClick={() => setActive(1)}
                >
                  My analytics
                </p>
              ) : null}
              <p
                className={
                  active === 0 ? `${styles.active}` : `${styles.inactive}`
                }
                onClick={() => setActive(0)}
              >
                My Starknet Achievements
              </p>
            </div>
            {!active ? (
              <>
                <div className={styles.content}>
                  {userNft && userNft.length
                    ? userNft.map((nft, index) => {
                        return (
                          <NftCard
                            key={index}
                            image={nft.image_uri as string}
                            title={nft.name as string}
                            url={nft.aspect_link as string}
                          />
                        );
                      })
                    : null}
                </div>
                {nextUrl ? (
                  <div className="text-background ml-5 mr-5 flex justify-center items-center flex-col">
                    <Button onClick={() => loadMore()}>Load More</Button>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <PieChart />
                <div className={styles.content}></div>
              </>
            )}
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
