import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getBoosts } from "@services/apiService";
import TokenSymbol from "@components/quest-boost/TokenSymbol";
import { QuestsContext } from "@context/QuestsProvider";
import styles from "../../styles/quests.module.css";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type BoostRewardProps = {
  questId: number;
};

const BoostReward: FunctionComponent<BoostRewardProps> = ({ questId }) => {
  const { boostedQuests } = useContext(QuestsContext);
  const [boost, setBoost] = useState<Boost>();
  const [isQuestBoosted, setIsQuestBoosted] = useState<boolean>(false);
  const checkIfBoostedQuest = useCallback(async () => {
    if (!boostedQuests) return;
    if (boostedQuests.length > 0 && boostedQuests.includes(questId))
      setIsQuestBoosted(true);
  }, []);

  const fetchBoosts = useCallback(async (id: string) => {
    try {
      const response = await getBoosts();
      if (!response) return;
      const boost = response.find((b: Boost) =>
        b.quests.includes(parseInt(id))
      );
      if (!boost) return;
      setBoost(boost);
    } catch (err) {
      console.log("Error while fetching boost by id", err);
    }
  }, []);

  useEffect(() => {
    if (!isQuestBoosted) return;
    fetchBoosts(questId.toString());
  }, [isQuestBoosted, questId]);

  useEffect(() => {
    checkIfBoostedQuest();
  }, []);
  return (
    <>
      {boost && isQuestBoosted ? (
        <div className={styles.issuer} style={{ gap: 0, padding: "8px 16px" }}>
          <TokenSymbol tokenAddress={boost?.token} />
          <Typography type={TEXT_TYPE.BODY_DEFAULT} className="text-white ml-2 issuerText">{boost?.amount}</Typography>
        </div>
      ) : null}
    </>
  );
};

export default BoostReward;
