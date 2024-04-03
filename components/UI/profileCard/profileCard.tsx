import React, { useEffect, useState } from "react";
import styles from "@styles/dashboard.module.css";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import ShareIcon from "@components/UI/iconsComponents/icons/shareIcon";
import StarkIcon from "@components/UI/iconsComponents/icons/starknetIcon";
import { CDNImage } from "@components/cdn/image";
import useCreationDate from "@hooks/useCreationDate";
import { useStarkProfile } from "@starknet-react/core";


interface ProfileCardProps {
  profilePicture: string | undefined;
  identity: Identity | undefined;
  name: string | undefined;
  percentile: number | undefined;
  socialIcons: JSX.Element[];
  starkScore: number;
  trophies: string;
  xpBadge: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profilePicture,
  identity,
  name,
  percentile,
  socialIcons,
  starkScore,
  trophies,
  xpBadge,
}) => {
  // const sinceDate = useCreationDate(identity);
  const { data: profileData } = useStarkProfile({ address: identity?.addr });


  return (
    <div className={styles.dashboard_profile_card}>
      <div className={`${styles.left} ${styles.child}`}>
        <div className={styles.profile_picture_div}>
          <img
            className={styles.profile_picture_img}
            src={profilePicture}
          />
        </div>
      </div>
      <div className={`${styles.center} ${styles.child}`}>
        <p className={styles.profile_paragraph0}>Member since unknown</p>
        <h2 className={styles.profile_name}>{name}</h2>
        <div className={styles.address_div}>
          <CopyIcon width="24" color="white" />
          <p className={styles.profile_paragraph}>{identity?.addr}</p>
        </div>
        <p className={styles.profile_paragraph2}>
          You are <span className={styles.green_span}>better than {percentile}%</span> of other players.
        </p>
      </div>
      <div className={`${styles.right} ${styles.child}`}>
        <div className={styles.right_top}>
          <div className={styles.right_socials}>
            {socialIcons.map((icon, index) => (
              <div className={styles.social_icon} key={index}>
                {icon}
              </div>
            ))}
          </div>
          <div className={styles.right_share_button}>
            <ShareIcon width="20" color="white" />
            <p className={styles.profile_paragraph}> Share </p>
          </div>
        </div>
        <div className={styles.right_middle}></div>
        <div className={styles.right_bottom}>
          <div className={styles.right_bottom_content}>
            <StarkIcon width="20" />
            <p className={styles.profile_paragraph}>{starkScore}</p>
          </div>
          <div className={styles.right_bottom_content}>
            <CDNImage src={trophies} priority width={20} height={20} alt="trophy icon" />
            <p className={styles.profile_paragraph}>+10k</p>
          </div>
          <div className={styles.right_bottom_content}>
            <CDNImage src={xpBadge} priority width={20} height={20} alt="xp badge" />
            <p className={styles.profile_paragraph}>3,339</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;