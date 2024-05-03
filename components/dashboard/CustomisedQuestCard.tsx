import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import { CDNImg } from "@components/cdn/image";
import BoostReward from "@components/quests/boostReward";
import QuestCard from "@components/quests/questCard";
import questCardStyles from "@styles/quests.module.css";
import { getQuestById } from "@services/apiService";
import { QuestDocument } from "../../types/backTypes";
import { QuestDefault } from "@constants/common";
import { useRouter } from "next/navigation";
import QuestCardSkeleton from "@components/skeletons/QuestCardSkeleton";

type QuestProps = {
  id: number;
};

const QuestCardCustomised: FunctionComponent<QuestProps> = ({ id }) => {
  const router = useRouter();
  const [data, setData] = useState<QuestDocument>(QuestDefault);
  const fetchQuestData = useCallback(async () => {
    const res = await getQuestById(id.toString());
    if (!res || "error" in res) return;
    if (res) setData(res);
  }, [id]);

  useEffect(() => {
    fetchQuestData();
  }, [id]);
  return data.id !== 0 ? (
    <QuestCard
      id={id}
      imgSrc={data.img_card}
      title={data.title_card}
      issuer={{
        name: data.issuer,
        logoFavicon: data.logo,
      }}
      onClick={() => !data.expired && router.push(`/quest/${data.id}`)}
      disabled={data.expired}
    >
      <div
        className={`flex mt-2 mb-1 items-center ${
          data.expired ? "opacity-40" : null
        }`}
      >
        <p className="text-gray-400">{data.name}</p>
      </div>
      <div className="flex gap-2 mt-3 justify-center md:justify-start">
        <div className={questCardStyles.issuer}>
          {data.expired ? (
            <>
              <p className="text-white mr-2">Expired</p>
              <UnavailableIcon width="24" color="#D32F2F" />
            </>
          ) : (
            <>
              <CDNImg width={20} src={data.logo} loading="lazy" />
              <p className="text-white ml-2">{data.rewards_title}</p>
            </>
          )}
        </div>
        <BoostReward questId={id} />
      </div>
    </QuestCard>
  ) : (
    <QuestCardSkeleton />
  );
};

export default QuestCardCustomised;
