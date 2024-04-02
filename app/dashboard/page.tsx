"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ProfilePhoto from "../../public/visuals/profile.webp";
import styles from "@styles/dashboard.module.css";
import { useAccount } from "@starknet-react/core";
import { QuestsContext } from "@context/QuestsProvider";
import { useRouter } from "next/navigation";
import { useDebounce } from "@hooks/useDebounce";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import Divider from "@mui/material/Divider";
import Blur from "@components/shapes/blur";
import Avatar from "@components/UI/avatar";
import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import DashboardSkeleton from "@components/skeletons/dashboardSkeleton";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import StarkIcon from "../../components/UI/iconsComponents/icons/starknetIcon";
import ClickableTwitterIcon from "@components/UI/actions/clickable/clickableTwitterIcon";
import ClickableDiscordIcon from "@components/UI/actions/clickable/clickableDiscordIcon";
import ClickableGithubIcon from "@components/UI/actions/clickable/clickableGithubIcon";
import AchievementIcon from "@components/UI/iconsComponents/icons/achievementIcon";
import { CDNImage } from "@components/cdn/image";
import ShareIcon from "@components/UI/iconsComponents/icons/shareIcon";
import QuestCard from "@components/quests/questCard";
import RhinoSrc from "public/rhino/silverRhino.webp";
import { log } from "console";



export default function Page() {
  const router = useRouter();
  const { status, address } = useAccount();
  const { featuredQuest } = useContext(QuestsContext);

  const [duration, setDuration] = useState<string>("Last 7 Days");
  const [userPercentile, setUserPercentile] = useState<number>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [apiCallDelay, setApiCallDelay] = useState<boolean>(false);
  const searchAddress = useDebounce<string>(searchQuery, 200);
  const [currentSearchedAddress, setCurrentSearchedAddress] =
    useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [rankingdataloading, setRankingdataloading] = useState<boolean>(false);
  const [showNoresults, setShowNoresults] = useState(false);
  const [userAddress, setUserAddress] = useState<string>("");
  const isMobile = useMediaQuery("(max-width:768px)");


  return (
    <div className={styles.dashboard_container}>
      {loading ? (
        <div className={styles.dashboard_skeleton}>
          <DashboardSkeleton />
        </div>
      ) : (
        <>
        <div className={styles.dashboard_wrapper}>
            <div className={styles.blur1}>
              <Blur green />
            </div>
            <div className={styles.blur2}>
              <Blur green />
            </div>

            {/* Profile Card */}
            <div className={styles.dashboard_profile_card}>
                <div className={`${styles.left} ${styles.child}`}>
                    <div className={styles.profile_picture_div}>
                        <img className={styles.profile_picture_img}/>
                    </div>
                </div>
                <div className={`${styles.center} ${styles.child}`}>
                    <p className={styles.profile_paragraph0}>Member since 10 months</p>
                    <h2 className={styles.profile_name}>Momchillo.stark</h2>
                    <div className={styles.address_div}>
                        <CopyIcon width="24" color="white">
                        </CopyIcon>
                        <p className={styles.profile_paragraph}>0x0ffABC123abc1...ABC123abc</p>
                    </div>
                    <p className={styles.profile_paragraph2}>You are <span className={styles.green_span}>better than 90%</span> of players.</p>
                </div>
                <div className={`${styles.right} ${styles.child}`}>
                    <div className={styles.right_top}>
                        <div className={styles.right_socials}>
                            <div className={styles.social_icon}>
                            </div>
                            <div className={styles.social_icon}>
                            </div>
                            <div className={styles.social_icon}>
                            </div>
                        </div>
                        <div className={styles.right_share_button}>
                            <ShareIcon width="20" color="white"/>
                            <p className={styles.profile_paragraph}> Share </p>
                        </div>
                    </div>
                    <div className={styles.right_middle}>

                    </div>
                    <div className={styles.right_bottom}>
                        <div className={styles.right_bottom_content}>
                            <StarkIcon width="20"                               
                            />
                            <p className={styles.profile_paragraph}>
                                1,475
                            </p>
                        </div>
                        <div className={styles.right_bottom_content}>
                            <CDNImage
                                src={"/icons/trophy.svg"}
                                priority
                                width={20}
                                height={20}
                                alt="trophy icon"
                            />
                            
                            <p className={styles.profile_paragraph}>
                                +10k
                            </p>
                        </div>
                        <div className={styles.right_bottom_content}>
                            <CDNImage src={"/icons/xpBadge.svg"} priority width={20} height={20} alt="xp badge" />
                            <p className={styles.profile_paragraph}>
                                3,339
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Completed Quests */}
        <div className={styles.dashboard_completed_tasks_container}>
            <div className={styles.second_header_label}>
                <h2 className={styles.second_header}>Quests Completed</h2>
            </div>
            
            <div className={styles.quests_container}>
                <QuestCard 
                    children={undefined}
                    imgSrc={""}
                    title={"The Rhino Charge..."}
                    onClick={function (): void {
                    console.log("Quest click");
                    } }            
                >
                </QuestCard>
                <QuestCard 
                    children={undefined}
                    imgSrc={""}
                    title={"Starknet Pro Score X R..."}
                    onClick={function (): void {
                    console.log("Quest click");
                    } }            
                >
                </QuestCard>
                <QuestCard 
                    children={undefined}
                    imgSrc={""}
                    title={"Starknet Pro Score X R..."}
                    onClick={function (): void {
                    console.log("Quest click");
                    } }            
                >
                </QuestCard>
                <QuestCard 
                    children={undefined}
                    imgSrc={""}
                    title={"Starknet Pro Score X R..."}
                    onClick={function (): void {
                    console.log("Quest click");
                    } }            
                >
                </QuestCard>
                
            </div>
            
        </div>
          
        </>
      )}
    </div>
  );
}


