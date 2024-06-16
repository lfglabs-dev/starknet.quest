"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/admin.module.css";
import BackButton from "@components/UI/backButton";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";

import { QuestDocument } from "../../../types/backTypes";
import FeaturedQuestSkeleton from "@components/skeletons/questsSkeleton";
import { AdminService } from "@services/authService";
import { QuestDefault } from "@constants/common";
import Button from "@components/UI/button";
import Quest from "@components/admin/questCard";
import { useNotification } from "@context/NotificationProvider";
import { getExpireTimeFromJwt } from "@utils/jwt";

export default function Page() {
  const router = useRouter();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(true);
  const { showNotification } = useNotification();

  const [quests, setQuests] = useState<[QuestDocument]>([QuestDefault]);

  useEffect(() => {
    const tokenExpiryTime = getExpireTimeFromJwt();
    if (!tokenExpiryTime || tokenExpiryTime < new Date().getTime()) return;
    router.push("/admin/quests");
  }, []);

  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await AdminService.getQuests();
      setQuests(res);
      setLoading(false);
    } catch (error) {
      showNotification("Error while fetching quests", "error");
      console.log("Error while fetching quests", error);
    }
  }, []);

  const handleCreateQuest = useCallback(() => {
    router.push("/admin/quests/create");
  }, []);

  const handleEditQuest = useCallback(() => {
    router.push("/admin/quests/edit");
  }, []);
  useEffect(() => {
    fetchQuests();
  }, [address]);

  return (
    <div className="flex flex-col w-full pt-28 g-8">
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>
      <div className={styles.screenContainer}>
        <div className={styles.questsBanner}>
          <div>
            <p>Admin</p>
            <p className={styles.questListHeading}>Your quests</p>
            <p>{quests?.length} quests</p>
          </div>
          <div>
            <Button onClick={handleCreateQuest}>
              <p>Create new quest</p>
            </Button>
          </div>
        </div>
        <div className={styles.card_container}>
          {loading ? (
            <FeaturedQuestSkeleton />
          ) : (
            quests &&
            quests.map((quest: QuestDocument) => {
              return (
                <Quest
                  key={quest.id}
                  title={quest.title_card}
                  onClick={() =>
                    router.push(`/admin/quests/dashboard/${quest.id}`)
                  }
                  imgSrc={quest.img_card}
                  reward={quest.disabled ? "Disabled" : "Active"}
                  id={quest.id}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
