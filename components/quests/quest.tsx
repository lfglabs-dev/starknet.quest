import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useContext } from "react";
import { QuestsContext } from "@context/QuestsProvider";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";
import QuestCard from "./questCard";
import { getBoosts } from "@services/apiService";
import TokenSymbol from "@components/quest-boost/TokenSymbol";
import { TOKEN_DECIMAL_MAP } from "@utils/constants";
import { getTokenName } from "@utils/tokenService";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  issuer: Issuer;
  reward: string;
  id: number;
  expired: boolean;
};

const Quest: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  reward,
  id,
  expired,
}) => {
  const { completedQuestIds, boostedQuests } = useContext(QuestsContext);
  const isCompleted = useMemo(
    () => completedQuestIds.includes(id),
    [id, completedQuestIds]
  );
  const [boost, setBoost] = useState<Boost>();
  const [isQuestBoosted, setIsQuestBoosted] = useState<boolean>(false);

  const checkIfBoostedQuest = useCallback(async () => {
    if (!boostedQuests) return;
    if (boostedQuests.length > 0 && boostedQuests.includes(id))
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
    fetchBoosts(id.toString());
  }, [isQuestBoosted, id]);

  useEffect(() => {
    checkIfBoostedQuest();
  }, []);

  return (
    <QuestCard
      imgSrc={imgSrc}
      title={title}
      onClick={() => !expired && onClick()}
      disabled={expired}
    >
      <div
        className={`flex mt-2 mb-1 items-center ${
          expired ? "opacity-40" : null
        }`}
      >
        <p className="text-gray-400">{issuer.name}</p>
      </div>
      <div className="flex gap-2">
        <div className={styles.issuer}>
          {isCompleted ? (
            <>
              <p className="text-white mr-2">Done</p>
              <CheckIcon width="24" color="#6AFFAF" />
            </>
          ) : expired ? (
            <>
              <p className="text-white mr-2">Expired</p>
              <UnavailableIcon width="24" color="#D32F2F" />
            </>
          ) : (
            <>
              <CDNImg width={20} src={issuer.logoFavicon} />
              <p className="text-white ml-2">{reward}</p>
            </>
          )}
        </div>
        {boost && isQuestBoosted ? (
          <div
            className={styles.issuer}
            style={{ gap: 0, padding: "8px 16px" }}
          >
            <TokenSymbol tokenAddress={boost?.token} />
            <p className="text-white ml-2">{boost?.amount}</p>
          </div>
        ) : null}
      </div>
    </QuestCard>
  );
};

export default Quest;
