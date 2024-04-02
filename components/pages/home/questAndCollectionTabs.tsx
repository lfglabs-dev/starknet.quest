import React, { FunctionComponent } from "react";
import styles from "@styles/Home.module.css";
import { Tab, Tabs } from "@mui/material";
import { useAccount } from "@starknet-react/core";
import Quest from "@components/quests/quest";
import { useRouter } from "next/navigation";
import QuestCategory from "@components/quests/questCategory";
import QuestsSkeleton from "@components/skeletons/questsSkeleton";
import { QuestDocument } from "../../../types/backTypes";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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

function a11yProps(index: number) {
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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className={styles.featured_quest_banner_container}>
      <section className={styles.section}>
        <div className="w-full">
          <div>
            <Tabs
              style={{ borderBottom: "0.5px solid rgba(224, 224, 224, 0.3)" }}
              className="pb-4"
              value={tabIndex}
              onChange={handleChangeTab}
              aria-label="quests and collectons tabs"
              indicatorColor="secondary"
            >
              <Tab
                sx={{ borderRadius: "12px" }}
                label={`Quests (${
                  address ? trendingQuests.length : quests.length
                })`}
                {...a11yProps(0)}
              />
              <Tab
                sx={{ borderRadius: "12px" }}
                label={`Collections (${categories.length})`}
                {...a11yProps(1)}
              />
            </Tabs>
          </div>
          <CustomTabPanel value={tabIndex} index={0}>
            {isConnecting ? (
              "Connecting to wallet..."
            ) : (
              <div className="flex flex-wrap gap-10">
                {address
                  ? trendingQuests.map((quest) => (
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
                    ))
                  : quests.map((quest) => (
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
            <div className="space-y-6">
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
        </div>
      </section>
    </div>
  );
};

export default QuestAndCollectionTabs;
