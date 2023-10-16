import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/profile.module.css";
import { useRouter } from "next/router";
import { isHexString, minifyAddressWithChars } from "../utils/stringService";
import { Connector, useAccount, useConnectors } from "@starknet-react/core";
import SocialMediaActions from "../components/UI/actions/socialmediaActions";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import { Tooltip } from "@mui/material";
import { hexToDecimal } from "../utils/feltService";
import { minifyAddress } from "../utils/stringService";
import { utils } from "starknetid.js";
import ErrorScreen from "../components/UI/screens/errorScreen";
import ProfileCard from "../components/UI/profileCard";
import { Land } from "../components/lands/land";
import { hasVerifiedSocials } from "../utils/profile";
import { useMediaQuery } from "@mui/material";
import VerifiedIcon from "../components/UI/iconsComponents/icons/verifiedIcon";
import CopyIcon from "../components/UI/iconsComponents/icons/copyIcon";
import useExpiryDate from "../hooks/useExpiryDate";

const AddressOrDomain: NextPage = () => {
  const router = useRouter();
  const { addressOrDomain } = router.query;
  const { address } = useAccount();
  const { connectors, connect } = useConnectors();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [initProfile, setInitProfile] = useState(false);
  const [identity, setIdentity] = useState<Identity>();
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const dynamicRoute = useRouter().asPath;
  const isMobile = useMediaQuery("(max-width:768px)");
  const [achievements, setAchievements] = useState<BuildingsInfo[]>([]);
  const [soloBuildings, setSoloBuildings] = useState<BuildingsInfo[]>([]);
  const [selectedTab, setSelectedTab] = useState<LandTabs>("nfts");
  const sinceDate = useExpiryDate(identity);

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
    setAchievements([]);
    setSoloBuildings([]);
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
              if (hexToDecimal(address) === hexToDecimal(data.addr))
                setIsOwner(true);
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
              addr: addr,
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
                    if (hexToDecimal(address) === hexToDecimal(data.addr))
                      setIsOwner(true);
                    setInitProfile(true);
                  });
                })
                .catch(() => {
                  return;
                });
            } else {
              setIdentity({
                starknet_id: "0",
                addr: addressOrDomain,
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
              addr: addressOrDomain,
              domain: minifyAddress(addressOrDomain),
              is_owner_main: false,
            });
            setIsOwner(false);
            setInitProfile(true);
          }
        })
        .catch(() => {
          setIdentity({
            starknet_id: "0",
            addr: addressOrDomain,
            domain: minifyAddress(addressOrDomain),
            is_owner_main: false,
          });
          setInitProfile(true);
          if (hexToDecimal(addressOrDomain) === hexToDecimal(address))
            setIsOwner(true);
        });
    } else {
      setNotFound(true);
    }
  }, [addressOrDomain, address, dynamicRoute]);

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(identity?.addr as string);
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

  const getIdentityData = async (id: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/id_to_data?id=${id}`
    );
    return response.json();
  };

  return (
    <div className={styles.profileBg}>
      {initProfile && identity ? (
        <>
          <Land
            address={identity.addr}
            isOwner={isOwner}
            isMobile={isMobile}
            setAchievements={setAchievements}
            setSoloBuildings={setSoloBuildings}
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
                      <div className="cursor-pointer absolute">
                        {!copied ? (
                          <Tooltip title="Copy" arrow>
                            <div onClick={() => copyToClipboard()}>
                              <CopyIcon width={"18"} color="#F4FAFF" />
                            </div>
                          </Tooltip>
                        ) : (
                          <VerifiedIcon width={"18"} />
                        )}
                      </div>
                      <div className={styles.address}>
                        {typeof addressOrDomain === "string" &&
                        isHexString(addressOrDomain)
                          ? minifyAddressWithChars(addressOrDomain, 8)
                          : minifyAddressWithChars(identity?.addr, 8)}
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
            {hasVerifiedSocials(identity) ? (
              <ProfileCard
                title="Social network"
                content={<SocialMediaActions identity={identity} />}
              />
            ) : null}
            <ProfileCard
              title="Progress"
              content={
                <>
                  <div className={styles.tabs}>
                    <div
                      className={`${styles.tab} ${
                        selectedTab === "nfts" ? styles.selectedTab : ""
                      }`}
                      onClick={() => setSelectedTab("nfts")}
                    >
                      NFTs unlocked ({soloBuildings.length})
                    </div>
                    <div
                      className={`${styles.tab} ${
                        selectedTab === "achievements" ? styles.selectedTab : ""
                      }`}
                      onClick={() => setSelectedTab("achievements")}
                    >
                      Achievements ({achievements.length})
                    </div>
                  </div>
                  {selectedTab === "nfts" ? (
                    <div className={styles.gallery}>
                      {soloBuildings.map((building) => {
                        return (
                          <div
                            key={building.id}
                            className={styles.nftContainer}
                          >
                            <img
                              src={building.img_url}
                              className={styles.nftImage}
                            />
                            <p className={styles.nftName}>{building.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                  {selectedTab === "achievements" ? (
                    <div className={styles.gallery}>
                      {achievements.map((achievement) => {
                        return (
                          <div
                            key={achievement.id}
                            className={styles.nftContainer}
                          >
                            <img
                              src={achievement.img_url}
                              className={styles.achievementImage}
                            />
                            <p className={styles.achievementLvl}>
                              Level {achievement.level}
                            </p>
                            <p className={styles.achievementName}>
                              {achievement.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </>
              }
            />
          </div>
        </>
      ) : (
        <div
          className={`h-screen flex justify-center items-center ${styles.name}`}
        >
          <h2>Loading</h2>
        </div>
      )}
    </div>
  );
};

export default AddressOrDomain;
