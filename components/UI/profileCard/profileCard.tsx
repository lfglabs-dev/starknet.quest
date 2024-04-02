import { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import { useMediaQuery } from "@mui/material";
import { Skeleton } from "@mui/material";

type ProfileCardProps = {
  name?: string;
  imgSrc?: string;
  memberSince?: number;
  walletAddress?: string;
  twitterUrl?: string;
  discordUrl?: string;
  githubUrl?: string;
  rankingBetterThanPercentage?: number;
};
// ovo treba modifikovati

const ProfileCard: FunctionComponent<ProfileCardProps> = ({
    name,
    imgSrc,
    memberSince,
    walletAddress,
    twitterUrl,
    discordUrl,
    githubUrl,
    rankingBetterThanPercentage
}) => {
    return (
        <>
        <div className="profileCardLayer">

        </div>
        </>
    );
}

export default ProfileCard;