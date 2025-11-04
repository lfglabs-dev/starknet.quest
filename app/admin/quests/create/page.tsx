"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "@styles/admin.module.css";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import { questDefaultInput } from "@constants/admin";
import { CreateQuest } from "../../../../types/backTypes";
import { useNotification } from "@context/NotificationProvider";
import { getExpireTimeFromJwt } from "@utils/jwt";
import FormContainer from "@components/admin/FormContainer";
import QuestDetailsForm from "@components/admin/formSteps/QuestDetailsForm";

export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [questInput, setQuestInput] = useState<CreateQuest>(questDefaultInput);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { showNotification } = useNotification();
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const tokenExpiryTime = getExpireTimeFromJwt();
    if (!tokenExpiryTime || tokenExpiryTime < new Date().getTime()) {
      router.push("/admin");
    }
  }, []);

  const isButtonDisabled = useMemo(() => {
    const questInputValid =
      !questInput.name ||
      !questInput.desc ||
      !questInput.start_time ||
      !questInput.expiry ||
      !questInput.category;
    return questInputValid;
  }, [questInput]);

  const handleCreateQuest = useCallback(async () => {
    try {
      const response = await AdminService.createQuest(questInput);
      if (!response) return;
      return Number(response.id);
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [questInput]);

  const handleQuestInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setQuestInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  useEffect(() => {
    //check if start time is less than current time
    if (new Date(parseInt(startTime)).getTime() < new Date().getTime()) {
      showNotification("Start time cannot be less than current time", "info");
      return;
    }
    setQuestInput((prev) => ({
      ...prev,
      start_time: new Date(parseInt(startTime)).getTime(),
    }));
  }, [startTime]);

  useEffect(() => {
    // check if start_time is greater than end_time
    if (new Date(parseInt(endTime)).getTime() < new Date(startTime).getTime()) {
      showNotification("End time cannot be less than start time", "info");
      return;
    }
    setQuestInput((prev) => ({
      ...prev,
      expiry: new Date(parseInt(endTime)).getTime(),
    }));
  }, [endTime]);

  const handleQuestCreate = useCallback(async () => {
    setButtonLoading(true);
    const id = await handleCreateQuest();
    setButtonLoading(false);
    router.push(`/admin/quests/dashboard/${id}?tab=1`);
  }, [questInput]);

  return (
    <div className={styles.layout_screen}>
      <FormContainer
        headingText="Create Quest"
        steps={["Setup"]}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      >
        <QuestDetailsForm
          setQuestInput={setQuestInput}
          setEndTime={setEndTime}
          setStartTime={setStartTime}
          startTime={startTime}
          endTime={endTime}
          questInput={questInput}
          handleQuestInputChange={handleQuestInputChange}
          submitButtonDisabled={isButtonDisabled}
          onSubmit={handleQuestCreate}
          buttonLoading={buttonLoading}
        />
      </FormContainer>
    </div>
  );
}
