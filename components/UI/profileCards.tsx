import React, { FunctionComponent, useState } from "react";
import styles from "../../styles/profile.module.css";
import { Tooltip } from "@mui/material";
import CopyIcon from "./iconsComponents/icons/copyIcon";
import VerifiedIcon from "./iconsComponents/icons/verifiedIcon";
import { minifyAddressFromStrings } from "../../utils/stringService";
import SocialMediaActions from "./actions/socialmediaActions";
import ShareIcon from "./iconsComponents/icons/shareIcon";
import SharePopup from "./menus/sharePopup";
import theme from "../../styles/theme";
import { useStarkProfile } from "@starknet-react/core";
import { CDNImg } from "../cdn/image";

const ProfileCards: FunctionComponent<ProfileCard> = ({
  title,
  identity,
  addressOrDomain,
  sinceDate,
  achievements,
  soloBuildings,
}) => {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState<LandTabs>("nfts");
  const [copied, setCopied] = useState(false);
  const { data: profileData } = useStarkProfile({ address: identity?.addr });

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(identity?.addr as string);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <>
      <div className={styles.profileCard}>
        <h2 className={`${styles.title} uppercase`}>{title}</h2>
        <div className={styles.divider} />
        <>
          <div className={styles.nameCard}>
            <div className={styles.profilePicture}>
              <img
                width={"350px"}
                src={profileData?.profilePicture}
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
                <div className="modified-cursor-pointer absolute">
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
                    minifyAddressFromStrings(
                      [addressOrDomain, identity?.addr || ""],
                      8
                    )}
                </div>
              </div>
              {sinceDate ? (
                <div className={styles.memberSince}>
                  <p>{sinceDate}</p>
                </div>
              ) : null}
            </div>
          </div>
          <>
            <div className={styles.divider} />
            <div className="flex items-center w-full my-1">
              <SocialMediaActions identity={identity} />
              <button
                onClick={() => setShowSharePopup(true)}
                className={styles.shareButton}
              >
                <ShareIcon color={theme.palette.secondary.dark} width="16px" />
                <p>Share</p>
              </button>
            </div>
          </>
        </>
      </div>
      <div className={`${styles.profileCard} overflow-auto`}>
        <h2 className={styles.title}>Progress</h2>
        <div className={styles.divider} />
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
                if (!building.image_url) return null;
                return (
                  <div key={building.nft_id} className={styles.nftContainer}>
                    <CDNImg src={building.image_url} className={styles.nftImage} />
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
                  <div key={achievement.id} className={styles.nftContainer}>
                    <img
                      src={achievement.img_url}
                      className={styles.achievementImage}
                    />
                    <p className={styles.achievementLvl}>
                      Level {achievement.level}
                    </p>
                    <p className={styles.achievementName}>{achievement.name}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      </div>
      {showSharePopup ? (
        <SharePopup
          close={() => setShowSharePopup(false)}
          toCopy={window.location.href}
        />
      ) : null}
    </>
  );
};

export default ProfileCards;
