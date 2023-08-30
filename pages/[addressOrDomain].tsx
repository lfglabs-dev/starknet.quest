import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/profile.module.css";
import { useRouter } from "next/router";
import { isHexString, minifyAddressWithChars } from "../utils/stringService";
import { Connector, useAccount, useConnectors } from "@starknet-react/core";
import SocialMediaActions from "../components/UI/actions/socialmediaActions";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import CopiedIcon from "../components/UI/iconsComponents/icons/copiedIcon";
import { Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { decimalToHex, hexToDecimal } from "../utils/feltService";
import { minifyAddress } from "../utils/stringService";
import { utils } from "starknetid.js";
import ErrorScreen from "../components/UI/screens/errorScreen";
import ProfileCard from "../components/UI/profileCard";
import TrophyIcon from "../components/UI/iconsComponents/icons/trophyIcon";
import { Land } from "../components/lands/Land";
import { getIdentityData, hasVerifiedSocials } from "../utils/identity";
import { useMediaQuery } from "@mui/material";

const AddressOrDomain: NextPage = () => {
  const router = useRouter();
  const { addressOrDomain } = router.query;
  const { address, connector } = useAccount();
  const { connectors, connect } = useConnectors();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [initProfile, setInitProfile] = useState(false);
  const [identity, setIdentity] = useState<Identity>();
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const dynamicRoute = useRouter().asPath;
  const isBraavosWallet = connector && connector.id === "braavos";
  const [braavosScore, setBraavosScore] = useState<number>(0);
  const [totalNFTs, setTotalNfts] = useState<number>(0);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [sinceDate, setSinceDate] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipData, setTooltipData] = useState<number | null>(0);

  useEffect(() => setNotFound(false), [dynamicRoute]);

  useLayoutEffect(() => {
    async function tryAutoConnect(connectors: Connector[]) {
      const lastConnectedConnectorId =
        localStorage.getItem("lastUsedConnector");
      if (lastConnectedConnectorId === null) {
        return;
      }

      const lastConnectedConnector = connectors.find(
        (connector) => connector.id === lastConnectedConnectorId
      );
      if (lastConnectedConnector === undefined) {
        return;
      }

      try {
        if (!(await lastConnectedConnector.ready())) {
          // Not authorized anymore.
          return;
        }

        await connect(lastConnectedConnector);
      } catch {
        // no-op
      }
    }

    if (!address) {
      tryAutoConnect(connectors);
    }
  }, []);

  useEffect(() => {
    setInitProfile(false);
  }, [address, addressOrDomain]);

  useEffect(() => {
    if (!address) setIsOwner(false);
  }, [address]);

  useEffect(() => {
    if (
      typeof addressOrDomain === "string" &&
      addressOrDomain?.toString().toLowerCase().endsWith(".stark")
    ) {
      if (
        !utils.isBraavosSubdomain(addressOrDomain) &&
        !utils.isXplorerSubdomain(addressOrDomain)
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
                starknet_id: id.toString(),
              });
              if (hexToDecimal(address) === data.addr) setIsOwner(true);
              setInitProfile(true);
            });
          })
          .catch(() => {
            return;
          });
      } else {
        starknetIdNavigator
          ?.getAddressFromStarkName(addressOrDomain)
          .then((addr) => {
            setIdentity({
              starknet_id: "0",
              addr: hexToDecimal(addr),
              domain: addressOrDomain,
              is_owner_main: false,
            });
            setInitProfile(true);
            if (hexToDecimal(address) === hexToDecimal(addr)) setIsOwner(true);
          })
          .catch(() => {
            return;
          });
      }
    } else if (
      typeof addressOrDomain === "string" &&
      isHexString(addressOrDomain)
    ) {
      starknetIdNavigator
        ?.getStarkName(hexToDecimal(addressOrDomain))
        .then((name) => {
          if (name) {
            if (
              !utils.isBraavosSubdomain(name) &&
              !utils.isXplorerSubdomain(name)
            ) {
              starknetIdNavigator
                ?.getStarknetId(name)
                .then((id) => {
                  getIdentityData(id).then((data: Identity) => {
                    if (data.error) return;
                    setIdentity({
                      ...data,
                      starknet_id: id.toString(),
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
                starknet_id: "0",
                addr: hexToDecimal(addressOrDomain),
                domain: name,
                is_owner_main: false,
              });
              setInitProfile(true);
              if (hexToDecimal(addressOrDomain) === hexToDecimal(address))
                setIsOwner(true);
            }
          } else {
            setIdentity({
              starknet_id: "0",
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
  }, [addressOrDomain, address, dynamicRoute]);

  useEffect(() => {
    // connector is of type Connector<any> in starknet-react
    // but _wallet which is supposed to be of type IStarknetWindowObject is set as private
    if (connector && connector.id === "braavos") {
      (connector as any)._wallet
        .request({ type: "wallet_getStarknetProScore" })
        .then((score: BraavosScoreProps) => {
          setBraavosScore(score.score);
        });
    } else {
      setBraavosScore(0);
    }
  }, [connector, addressOrDomain, address]);

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(decimalToHex(identity?.addr));
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  if (notFound) {
    return (
      <ErrorScreen
        errorMessage="Profile or Page not found"
        buttonText="Go back to quests"
        onClick={() => router.push("/")}
      />
    );
  }

  return initProfile && identity ? (
    <>
      <Land
        address={decimalToHex(identity.addr)}
        isOwner={isOwner}
        setNFTCounter={setTotalNfts}
        isMobile={isMobile}
        setSinceDate={setSinceDate}
        // todo: delete this ?
        setShowTooltip={setShowTooltip}
        setTooltipData={setTooltipData}
        hasDomain={identity.domain ? true : false}
      />
      <div className={styles.profiles}>
        <ProfileCard
          title={identity?.domain ?? minifyAddress(identity.addr)}
          isUppercase={true}
          content={
            <div className={styles.nameCard}>
              <div className={styles.profilePicture}>
                <img
                  width={"350px"}
                  src={`https://www.starknet.id/api/identicons/${identity?.starknet_id}`}
                  alt="starknet.id avatar"
                  style={{ maxWidth: "150%" }}
                />
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
              <div>
                <div className={styles.starknetInfo}>
                  <div className="cursor-pointer">
                    {!copied ? (
                      <Tooltip title="Copy" arrow>
                        <ContentCopy
                          className={styles.contentCopy}
                          onClick={() => copyToClipboard()}
                          sx={{ width: "16px", height: "16px" }}
                        />
                      </Tooltip>
                    ) : (
                      <CopiedIcon color="#6affaf" width="16" />
                    )}
                  </div>
                  <div className={styles.address}>
                    {typeof addressOrDomain === "string" &&
                    isHexString(addressOrDomain)
                      ? minifyAddressWithChars(addressOrDomain, 8)
                      : minifyAddressWithChars(decimalToHex(identity?.addr), 8)}
                  </div>
                </div>
                {sinceDate ? (
                  <div className={styles.memberSince}>
                    <p>{sinceDate}</p>
                  </div>
                ) : null}
              </div>
            </div>
          }
        />
        <ProfileCard
          title="Progress"
          content={
            <div
              className={`${styles.progress} ${
                isBraavosWallet && isOwner
                  ? "justify-between"
                  : "justify-around"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className={styles.polygonContainer}>
                  <img src="/icons/polygon.svg" alt="polygon icon" />
                  <span className={styles.xp}>XP</span>
                </div>
                <span>12</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className={styles.trophy}>
                  <TrophyIcon width="20" color="#696045" />
                </span>
                <span>12</span>
              </div>
              <div className="flex flex-col gap-1">
                <img
                  src="/icons/verifyBadge.svg"
                  alt="verfy badge icon"
                  width={25}
                />
                <span>{totalNFTs}</span>
              </div>
              {isOwner && isBraavosWallet ? (
                <div className="flex flex-col gap-1">
                  <img
                    src="/braavos/braavosLogo.svg"
                    alt="braavos icon"
                    width={24}
                  />
                  <span>{braavosScore}</span>
                </div>
              ) : null}
            </div>
          }
        />
        {hasVerifiedSocials(identity) ? (
          <ProfileCard
            title="Social network"
            content={<SocialMediaActions identity={identity} />}
          />
        ) : null}
      </div>
    </>
  ) : (
    <div className={`h-screen flex justify-center items-center ${styles.name}`}>
      <h2>Loading</h2>
    </div>
  );
};

export default AddressOrDomain;
