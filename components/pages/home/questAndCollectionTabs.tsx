import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getPendingBoostClaims } from "@services/apiService";
import styles from "@styles/Home.module.css";
import { Tab, Tabs } from "@mui/material";
import { useAccount } from "@starknet-react/core";
import Quest from "@components/quests/quest";
import QuestClaim from "@components/quests/questClaim";
import { useRouter } from "next/navigation";
import QuestCategory from "@components/quests/questCategory";
import QuestsSkeleton from "@components/skeletons/questsSkeleton";
import {
  ClaimableQuestDocument,
  QuestDocument,
} from "../../../types/backTypes";
import Link from "next/link";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import { QuestsContext } from "@context/QuestsProvider";
import { getBoosts } from "@services/apiService";
import { MILLISECONDS_PER_WEEK } from "@constants/common";
import { getClaimableQuests } from "@utils/quest";
import { hexToDecimal } from "@utils/feltService";
import { PendingBoostClaim } from "types/backTypes";

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div className="pt-6">{children}</div>}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
type QuestAndCollectionTabsProps = {
  categories: QuestCategory[];
  quests: QuestDocument[];
  trendingQuests: QuestDocument[];
};

const QuestAndCollectionTabs: FunctionComponent<
  QuestAndCollectionTabsProps
> = ({ quests, trendingQuests, categories }) => {
  const router = useRouter();
  const { address, isConnecting } = useAccount();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabIndex(newValue);
    },
    []
  );

  const sortedAndFilteredQuests = useMemo(() => {
    const filteredQuests = quests
      .filter((quest) => {
        return (
          !quest.expired && !trendingQuests.find((tq) => tq.id === quest.id)
        );
      })
      .sort((questA, questB) => {
        const aExpiry = questA.expiry_timestamp
          ? Number(questA.expiry_timestamp)
          : Number.MAX_SAFE_INTEGER;
        const bExpiry = questB.expiry_timestamp
          ? Number(questB.expiry_timestamp)
          : Number.MAX_SAFE_INTEGER;
        return aExpiry - bExpiry; // Quests that expired soon will be first
      });
    return [...trendingQuests, ...filteredQuests];
  }, [address, quests, trendingQuests]);

  const [boosts, setBoosts] = useState<Boost[]>([]);
  const { completedBoostIds } = useContext(QuestsContext);
  const [claimableQuests, setClaimableQuests] = useState<
    ClaimableQuestDocument[]
  >([]);
  const [pendingBoostClaims, setpendingBoostClaims] = useState<
    PendingBoostClaim[] | undefined
  >([]);

  const fetchBoosts = async () => {
    try {
      const res = await getBoosts();
      const filteredResponse = res?.filter(
        (boost) =>
          (new Date().getTime() - boost.expiry) / MILLISECONDS_PER_WEEK <= 3
      );
      if (filteredResponse && filteredResponse?.length > 0)
        setBoosts(filteredResponse);
    } catch (err) {
      console.log("Error while fetching boosts", err);
    }
  };

  useEffect(() => {
    fetchBoosts();
  }, []);

  useEffect(() => {
    const getAllPendingBoostClaims = async () => {
      const allPendingClaims = await getPendingBoostClaims(
        hexToDecimal(address)
      );
      if (allPendingClaims) {
        setpendingBoostClaims(allPendingClaims);
      }
    };

    getAllPendingBoostClaims();
  }, [address]);

  useEffect(() => {
    const data = getClaimableQuests(quests, pendingBoostClaims);
    if (data && data.length) {
      setClaimableQuests(data);
    }
  }, [quests, pendingBoostClaims]);

  const completedBoostNumber = useMemo(
    () => boosts?.filter((b) => completedBoostIds.includes(b.id)).length,
    [boosts, completedBoostIds]
  );

  return (
    <div className={styles.featured_quest_banner_container}>
      <section className={styles.section}>
        <div className="w-full">
          <div>
            <Tabs
              style={{
                borderBottom: "0.5px solid rgba(224, 224, 224, 0.3)",
              }}
              className="pb-4"
              value={tabIndex}
              onChange={handleChangeTab}
              aria-label="quests and collectons tabs"
              indicatorColor="secondary"
            >
              <Tab
                disableRipple
                sx={{
                  borderRadius: "10px",
                  padding: "0px 12px 0px 12px",
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "12px",
                  fontFamily: "Sora",
                  minHeight: "32px",
                }}
                label={`Quests (${sortedAndFilteredQuests.length})`}
                {...a11yProps(0)}
              />
              <Tab
                disableRipple
                sx={{
                  borderRadius: "10px",
                  padding: "0px 12px 0px 12px",
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "12px",
                  fontFamily: "Sora",
                  minHeight: "32px",
                }}
                label={`Collections (${categories.length + (boosts ? 1 : 0)})`}
                {...a11yProps(1)}
              />
              {address && (
                <Tab
                  disableRipple
                  sx={{
                    borderRadius: "10px",
                    padding: "0px 12px 0px 12px",
                    textTransform: "none",
                    fontWeight: "600",
                    fontSize: "12px",
                    fontFamily: "Sora",
                    minHeight: "32px",
                  }}
                  label={`To claim (${
                    claimableQuests ? claimableQuests.length : 0
                  })`}
                  {...a11yProps(2)}
                />
              )}
            </Tabs>
          </div>
          <CustomTabPanel value={tabIndex} index={0}>
            {isConnecting ? (
              "Connecting to wallet..."
            ) : (
              <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
                {sortedAndFilteredQuests.map((quest) => (
                  <Quest
                    key={quest.id}
                    title={quest.title_card}
                    onClick={() => router.push(`/quest/${quest.id}`)}
                    imgSrc={quest.img_card}
                    issuer={{
                      name: quest.issuer,
                      logoFavicon: quest.logo,
                    }}
                    reward={quest.rewards_title}
                    id={quest.id}
                    expired={quest.expired}
                  />
                ))}
              </div>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={tabIndex} index={1}>
            <div className="flex flex-col items-center space-y-6">
              {boosts.length !== 0 ? (
                <div className={styles.questCategoryContainer}>
                  <Link href={`/quest-boost`} className={styles.questCategory}>
                    <div className={styles.categoryInfos}>
                      <h2 className="text-gray-200">Boosts Quest</h2>
                      <p className="text-gray-200 normal-case">
                        {completedBoostNumber === boosts.length ? (
                          <span className="flex">
                            <span className="mr-2">All boosts done</span>
                            <CheckIcon width="24" color="#6AFFAF" />
                          </span>
                        ) : (
                          `${completedBoostNumber}/${boosts.length} Boost${
                            boosts.length > 1 ? "s" : ""
                          } done`
                        )}
                      </p>
                    </div>
                    <img src="/visuals/boost/logo.webp" />
                  </Link>
                </div>
              ) : null}
              {categories ? (
                categories.map((category) => {
                  return (
                    <QuestCategory key={category.name} category={category} />
                  );
                })
              ) : (
                <QuestsSkeleton />
              )}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={tabIndex} index={2}>
            {isConnecting ? (
              "Connecting to wallet..."
            ) : (
              <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
                {claimableQuests &&
                  claimableQuests.map((quest) => (
                    <QuestClaim
                      key={quest.id}
                      title={quest.title_card}
                      onClick={() =>
                        router.push(`/quest-boost/${quest.boostId}`)
                      }
                      imgSrc={quest.img_card}
                      name={quest.issuer}
                      reward={quest.rewards_title}
                      id={quest.boostId}
                      expired={quest.expired}
                    />
                  ))}
              </div>
            )}
          </CustomTabPanel>
        </div>
      </section>
    </div>
  );
};

export default QuestAndCollectionTabs;