"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "@styles/admin.module.css";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import { QuestDefault } from "@constants/common";
import {
  boostDefaultInput,
  formSteps,
  nft_uri,
  questDefaultInput,
} from "@constants/admin";
import { CreateQuest, NFTUri } from "../../../../types/backTypes";
import AdminQuestDetails from "@components/admin/questDetails";
import { useNotification } from "@context/NotificationProvider";
import { getExpireTimeFromJwt } from "@utils/jwt";
import FormContainer from "@components/admin/FormContainer";
import QuestDetailsForm from "@components/admin/formSteps/QuestDetailsForm";
import RewardDetailsForm from "@components/admin/formSteps/RewardDetailsForm";
import TaskDetailsForm from "@components/admin/formSteps/TaskDetailsForm";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [questId, setQuestId] = useState<number>(0);
  const [questInput, setQuestInput] = useState<CreateQuest>(questDefaultInput);
  const [nfturi, setNftUri] = useState<NFTUri>(nft_uri);
  const [showBoost, setShowBoost] = useState(false);
  const [boostInput, setBoostInput] = useState(boostDefaultInput);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showTwitterOption, setShowTwitterOption] = useState(-1);
  const [steps, setSteps] = useState<StepMap[]>([
    {
      type: "None",
      data: {},
    },
  ]);
  const { showNotification } = useNotification();
  const [finalQuestData, setFinalQuestData] =
    useState<typeof QuestDefault>(QuestDefault);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const tokenExpiryTime = getExpireTimeFromJwt();
    if (!tokenExpiryTime || tokenExpiryTime < new Date().getTime()) {
      router.push("/admin");
    }
  }, []);

  const isButtonDisabled = useMemo(() => {
    const boostInputValid =
      !boostInput.amount || !boostInput.num_of_winners || !boostInput.token;

    const nftUriValid = !nfturi.name || !nfturi.image;

    const questInputValid =
      !questInput.name ||
      !questInput.desc ||
      !questInput.start_time ||
      !questInput.expiry ||
      !questInput.category;

    const questRewardValid = !questInput.rewards_title || !questInput.logo;

    if (currentPage === 0) {
      return questInputValid;
    } else if (currentPage === 1) {
      return (showBoost && boostInputValid) || nftUriValid || questRewardValid;
    }
    if (currentPage === 2) {
      return steps.some((step) => step.type === "None");
    }
    return false;
  }, [currentPage, questInput, nfturi, steps, showBoost, boostInput]);

  const fetchQuestData = useCallback(async () => {
    try {
      const res = await AdminService.getQuestById(questId);
      if (!res) return;
      setFinalQuestData(res);
    } catch (error) {
      console.log("Error while fetching quests", error);
    }
  }, [questId]);

  useEffect(() => {
    if (currentPage !== 3) return;
    fetchQuestData();
  }, [currentPage]);

  const handleCreateQuest = useCallback(async () => {
    try {
      const response = await AdminService.createQuest(questInput);
      if (!response) return;
      setQuestId(Number(response.id));
      return Number(response.id);
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [questInput]);

  const handleCreateNftUri = useCallback(
    async (questId: number) => {
      try {
        const response = await AdminService.createNftUri({
          quest_id: questId,
          name: nfturi.name,
          desc: nfturi.description,
          image: nfturi.image,
        });
        if (!response) return;
        return Number(response.id);
      } catch (error) {
        console.log("Error while creating quest", error);
      }
    },
    [questInput, nfturi, questId]
  );

  const handleCreateBoost = useCallback(
    async (quest_id: number) => {
      try {
        if (!showBoost) return;
        const response = await AdminService.createBoost({
          ...boostInput,
          quest_id: quest_id,
          amount: Number(boostInput.amount),
          num_of_winners: Number(boostInput.num_of_winners),
        });
        if (!response) return;
      } catch (error) {
        console.log("Error while creating boost", error);
      }
    },
    [boostInput]
  );

  const handlePagination = useCallback((type: "Next" | "Back") => {
    if (type === "Next") {
      setCurrentPage((prev) => prev + 1);
    } else {
      setCurrentPage((prev) => prev - 1);
    }
  }, []);

  const handleQuestInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setQuestInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleBoostInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setBoostInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTasksInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const { name, value } = e.target;
      setSteps((prev) => {
        const newArr = [...prev];
        const new_obj = { ...newArr[index] };
        new_obj.data = { ...new_obj.data, [name]: value };
        newArr[index] = new_obj;
        return newArr;
      });
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
    setBoostInput((prev) => ({
      ...prev,
      expiry: new Date(parseInt(endTime)).getTime(),
    }));
  }, [endTime]);

  const handlePublishQuest = useCallback(
    async (value: boolean) => {
      await AdminService.updateQuest({
        id: questId,
        disabled: value,
      });
      await fetchQuestData();
    },
    [questId]
  );

  const handleQuestImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuestInput((prev) => ({
        ...prev,
        rewards_img: e.target.value,
        img_card: e.target.value,
      }));
      setNftUri((prev) => ({
        ...prev,
        image: e.target.value,
      }));
      setBoostInput((prev) => ({
        ...prev,
        img_url: e.target.value,
      }));
    },
    []
  );

  const handleQuestAndBoostCreate = useCallback(async () => {
    setButtonLoading(true);
    const id = await handleCreateQuest();
    if (!id) return;
    await handleCreateBoost(id);
    await handleCreateNftUri(id);
    await setButtonLoading(false);
    handlePagination("Next");
  }, [questInput, boostInput, nfturi]);

  const handleCreateTask = useCallback(async () => {
    setButtonLoading(true);
    steps.map(async (step) => {
      if (step.type === "Quiz") {
        if (
          step.data.quiz_name?.length === 0 ||
          step.data.quiz_desc?.length === 0 ||
          step.data.quiz_intro?.length === 0 ||
          step.data.quiz_cta?.length === 0 ||
          step.data.quiz_help_link?.length === 0
        ) {
          showNotification("Please fill all fields for Quiz", "info");
          return;
        }
        const response = await AdminService.createQuiz({
          quest_id: questId,
          name: step.data.quiz_name,
          desc: step.data.quiz_desc,
          intro: step.data.quiz_intro,
          cta: step.data.quiz_cta,
          help_link: step.data.quiz_help_link,
        });
        for (const question of step.data.questions) {
          try {
            await AdminService.createQuizQuestion({
              quiz_id: response.quiz_id,
              question: question.question,
              options: question.options,
              correct_answers: question.correct_answers,
            });
          } catch (error) {
            console.error("Error executing promise:", error);
          }
        }
      }
      if (step.type === "TwitterFw") {
        if (
          step.data.twfw_name?.length === 0 ||
          step.data.twfw_desc?.length === 0 ||
          step.data.twfw_username?.length === 0
        ) {
          showNotification("Please fill all fields for Twitter Follow", "info");
          return;
        }
        await AdminService.createTwitterFw({
          quest_id: questId,
          name: step.data.twfw_name,
          desc: step.data.twfw_desc,
          username: step.data.twfw_username,
        });
      } else if (step.type === "TwitterRw") {
        if (
          step.data.twrw_name?.length === 0 ||
          step.data.twrw_desc?.length === 0 ||
          step.data.twrw_post_link?.length === 0
        ) {
          showNotification(
            "Please fill all fields for Twitter Retweet",
            "info"
          );
          return;
        }
        await AdminService.createTwitterRw({
          quest_id: questId,
          name: step.data.twrw_name,
          desc: step.data.twrw_desc,
          post_link: step.data.twrw_post_link,
        });
      } else if (step.type === "Discord") {
        if (
          step.data.dc_name?.length === 0 ||
          step.data.dc_desc?.length === 0 ||
          step.data.dc_invite_link?.length === 0 ||
          step.data.dc_guild_id?.length === 0
        ) {
          showNotification("Please fill all fields for Discord", "info");
          return;
        }
        await AdminService.createDiscord({
          quest_id: questId,
          name: step.data.dc_name,
          desc: step.data.dc_desc,
          invite_link: step.data.dc_invite_link,
          guild_id: step.data.dc_guild_id,
        });
      } else if (step.type === "Custom") {
        if (
          step.data.custom_name?.length === 0 ||
          step.data.custom_desc?.length === 0 ||
          step.data.custom_cta?.length === 0 ||
          step.data.custom_href?.length === 0 ||
          step.data.custom_api?.length === 0
        ) {
          showNotification("Please fill all fields for Discord", "info");
          return;
        }
        await AdminService.createCustom({
          quest_id: questId,
          name: step.data.custom_name,
          desc: step.data.custom_desc,
          cta: step.data.custom_cta,
          href: step.data.custom_href,
          api: step.data.custom_api,
        });
      } else if (step.type === "Domain") {
        await AdminService.createDomain({
          quest_id: questId,
          name: step.data.domain_name,
          desc: step.data.domain_desc,
        });
      } else if (step.type === "Balance") {
        try {
          await AdminService.createBalance({
            quest_id: questId,
            name: step.data.balance_name,
            desc: step.data.balance_desc,
            contracts: step.data.balance_contracts,
            cta: step.data.balance_cta,
            href: step.data.balance_href,
          });
        } catch (error) {
          console.error("Error while creating balance task:", error);
        }
      }else if (step.type === "CustomApi") {
        try {
          await AdminService.createCustomApi({
            quest_id: questId,
            name: step.data.api_name,
            desc: step.data.api_desc,
            api_url: step.data.api_url,
            cta: step.data.api_cta,
            href: step.data.api_href,
            regex: step.data.api_regex
          });
        } catch (error) {
          console.error("Error while creating balance task:", error);
        }
      }
    });
    setButtonLoading(false);
    setCurrentPage((prev) => prev + 1);
  }, [steps]);

  const handleRemoveStep = useCallback(
    (index: number) => {
      setSteps((prev) => {
        const newArr = [...prev];
        newArr.splice(index, 1);
        return newArr;
      });
    },
    [steps]
  );

  const handleDeleteTasks = useCallback(async (removedTasks: StepMap[]) => {
    const taskPromises = removedTasks.map(async (step) => {
      await AdminService.deleteTask({
        id: step.data.id,
      });
    });

    await Promise.all(taskPromises);
  }, []);

  const renderFormStep = () => {
    if (currentPage === 0) {
      return (
        <QuestDetailsForm
          setQuestInput={setQuestInput}
          setEndTime={setEndTime}
          setStartTime={setStartTime}
          startTime={startTime}
          endTime={endTime}
          questInput={questInput}
          handleQuestInputChange={handleQuestInputChange}
          submitButtonDisabled={isButtonDisabled}
          onSubmit={() => setCurrentPage(currentPage + 1)}
        />
      );
    } else if (currentPage === 1) {
      return (
        <RewardDetailsForm
          setQuestInput={setQuestInput}
          questInput={questInput}
          boostInput={boostInput}
          setBoostInput={setBoostInput}
          nfturi={nfturi}
          setNftUri={setNftUri}
          handleQuestImageChange={handleQuestImageChange}
          handleBoostInputChange={handleBoostInputChange}
          handleQuestInputChange={handleQuestInputChange}
          submitButtonDisabled={isButtonDisabled}
          onSubmit={async () => await handleQuestAndBoostCreate()}
          showBoost={showBoost}
          setShowBoost={setShowBoost}
          buttonLoading={buttonLoading}
        />
      );
    } else if (currentPage === 2) {
      return (
        <TaskDetailsForm
          handleTasksInputChange={handleTasksInputChange}
          steps={steps}
          setSteps={setSteps}
          buttonLoading={buttonLoading}
          onSubmit={async () => {
            await handleCreateTask();
            showNotification("Quest created successfully", "success");
          }}
          isButtonDisabled={isButtonDisabled}
          showTwitterOption={showTwitterOption}
          setShowTwitterOption={setShowTwitterOption}
          deleteTasks={async (index) => {
            setButtonLoading(true);
            handleRemoveStep(index);
            await handleDeleteTasks([steps[index]]);
            setButtonLoading(false);
          }}
        />
      );
    } else if (currentPage === 3) {
      if (finalQuestData.id === 0) {
        return (
          <div>
            <Typography type={TEXT_TYPE.BODY_MIDDLE}>
              Please submit all the details of the quest
            </Typography>
          </div>
        );
      }
      return (
        <AdminQuestDetails
          quest={finalQuestData}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          setShowDomainPopup={() => {}}
          hasRootDomain={false}
          rewardButtonTitle={finalQuestData.disabled ? "Enable" : "Disable"}
          onRewardButtonClick={async () => {
            await handlePublishQuest(!finalQuestData.disabled);
            if (finalQuestData.disabled) {
              showNotification("Quest is disabled from launch", "success");
            } else {
              showNotification("Quest is enabled for launch", "success");
            }
            await fetchQuestData();
          }}
          overrideDisabledState={false}
        />
      );
    }
  };

  return (
    <div className={styles.layout_screen}>
      <FormContainer
        headingText="Create Quest"
        steps={formSteps}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      >
        {renderFormStep()}
      </FormContainer>
    </div>
  );
}
