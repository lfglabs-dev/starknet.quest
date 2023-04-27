import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/profile.module.css";
import { useRouter } from "next/router";
import { isHexString } from "../utils/stringService";
import { useAccount } from "@starknet-react/core";
import SocialMediaActions from "../components/UI/actions/socialmediaActions";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import CopiedIcon from "../components/UI/iconsComponents/icons/copiedIcon";
import { Tooltip } from "@mui/material";
import { ContentCopy, CameraAlt } from "@mui/icons-material";
import { decimalToHex, hexToDecimal } from "../utils/feltService";
import StarknetIcon from "../components/UI/iconsComponents/icons/starknetIcon";
import NftCard from "../components/UI/nftCard";

const AddressOrDomain: NextPage = () => {
  const router = useRouter();
  const { addressOrDomain } = router.query;
  const { address } = useAccount();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [initProfile, setInitProfile] = useState(false);
  const [identity, setIdentity] = useState<Identity>();
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [active, setActive] = useState(0);

  const dynamicRoute = useRouter().asPath;
  useEffect(() => setNotFound(false), [dynamicRoute]);

  useEffect(() => {
    setInitProfile(false);
  }, [router]);

  useEffect(() => {
    if (
      typeof addressOrDomain === "string" &&
      (addressOrDomain?.toString().toLowerCase().endsWith(".stark") ||
        isHexString(addressOrDomain as string))
    ) {
      starknetIdNavigator
        ?.getStarknetId(addressOrDomain)
        .then((id) => {
          fetch(`https://app.starknet.id/api/indexer/id_to_data?id=${id}`)
            .then((response) => response.json())
            .then((data: Identity) => {
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
      setNotFound(true);
    }
  }, [addressOrDomain, address]);

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(decimalToHex(identity?.addr));
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  if (notFound) {
    return <h2 className={styles.notFound}>Profile not found</h2>;
  }

  return initProfile && identity ? (
    <>
      <div className={styles.header}></div>
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
            <Tooltip title="Change profile picture" arrow>
              <div className={styles.cameraIcon}>
                <CameraAlt
                  className={styles.cameraAlt}
                  onClick={() => console.log("changing pfp")}
                />
              </div>
            </Tooltip>
          </div>
          <div className={styles.name}>{identity?.domain}</div>
          <div className={styles.starknetInfo}>
            <StarknetIcon width="32px" color="" />
            <div className={styles.address}>{decimalToHex(identity?.addr)}</div>

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
          <div className={styles.socials}>
            <div className="flex lg:justify-start justify-center lg:items-start items-center">
              <SocialMediaActions
                domain={identity?.domain}
                isOwner={isOwner}
                tokenId={identity?.id as string}
              />
            </div>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.menu}>
            <div className={styles.menuTitle}>
              <p
                className={
                  active === 1 ? `${styles.active}` : `${styles.inactive}`
                }
                onClick={() => setActive(1)}
              >
                My analytics
              </p>
              <p
                className={
                  active === 0 ? `${styles.active}` : `${styles.inactive}`
                }
                onClick={() => setActive(0)}
              >
                My NFT
              </p>
            </div>
            {!active ? (
              <>
                <div className={styles.content}>
                  <NftCard
                    image={"/visuals/Card.png"}
                    title="Un NFT"
                    onClick={() => window.open("#")}
                  />
                  <NftCard
                    image={"/visuals/Card.png"}
                    title="Un NFT"
                    onClick={() => window.open("#")}
                  />
                  <NftCard
                    image={"/visuals/Card.png"}
                    title="Un NFT"
                    onClick={() => window.open("#")}
                  />
                  <NftCard
                    image={"/visuals/Card.png"}
                    title="Un NFT"
                    onClick={() => window.open("#")}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  ) : (
    <p>Loading</p>
  );
};

export default AddressOrDomain;
