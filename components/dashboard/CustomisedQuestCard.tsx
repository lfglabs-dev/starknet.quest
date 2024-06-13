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
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

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
        <Typography type={TEXT_TYPE.BODY_DEFAULT} className="text-gray-400">{data.issuer}</Typography>
      </div>
      <div className="flex gap-2 mt-3 justify-center md:justify-start">
        <div className={questCardStyles.issuer}>
          {data.expired ? (
            <>
              <Typography type={TEXT_TYPE.BODY_DEFAULT} className="text-white mr-2 issuerText">Expired</Typography>
              <UnavailableIcon width="24" color="#D32F2F" />
            </>
          ) : (
            <>
              <CDNImg width={20} src={data.logo} loading="lazy" />
              <Typography type={TEXT_TYPE.BODY_DEFAULT} className="text-white ml-2 issuerText">{data.rewards_title}</Typography>
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
