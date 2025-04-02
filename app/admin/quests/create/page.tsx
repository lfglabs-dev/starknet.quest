"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
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
  const isSaving = useRef(false);
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
    router.push(`/admin/quests/dashboard/${id}?tab=2`);
  }, [questInput, boostInput, nfturi]);

  const handleCreateTask = useCallback(async () => {
    if (isSaving.current) return;
    try {
      isSaving.current = true;
      setButtonLoading(true);
      const unsavedSteps = steps.filter((step) => !step.data.id);
  
      for (const step of unsavedSteps) {
        try {
          let response: any;
          switch (step.type) {
            case "Quiz":
              if (!["quiz_name", "quiz_desc", "quiz_intro", "quiz_cta", "quiz_help_link"]
                .every(field => step.data[field]?.length > 0)) {
                showNotification("Please fill all fields for Quiz", "info");
                continue;
              }
              response = await AdminService.createQuiz({
                quest_id: questId,
                name: step.data.quiz_name,
                desc: step.data.quiz_desc,
                intro: step.data.quiz_intro,
                cta: step.data.quiz_cta,
                help_link: step.data.quiz_help_link,
              });
  
              if (response) {
                const failedQuestions = await Promise.allSettled(
                  step.data.questions.map((question: any) => 
                    AdminService.createQuizQuestion({
                      quiz_id: response.quiz_id,
                      question: question.question,
                      options: question.options,
                      correct_answers: question.correct_answers,
                    })
                  )
                ).then(results => 
                  results
                    .filter((result: any) => result.status === 'rejected')
                    .map((result: any) => result.reason)
                );
  
                if (failedQuestions.length > 0) {
                  showNotification(
                    `Failed to create ${failedQuestions.length} questions. Please review and try again.`,
                    "warning"
                  );
                }
                step.data.id = response.id;
              }
              break;
  
            case "TwitterFw":
              if (!["twfw_name", "twfw_desc", "twfw_username"]
                .every(field => step.data[field]?.length > 0)) {
                showNotification("Please fill all fields for Twitter Follow", "info");
                continue;
              }
              response = await AdminService.createTwitterFw({
                quest_id: questId,
                name: step.data.twfw_name,
                desc: step.data.twfw_desc,
                username: step.data.twfw_username,
              });
              if (response) step.data.id = response.id;
              break;
  
            case "TwitterRw":
              if (!["twrw_name", "twrw_desc", "twrw_post_link"]
                .every(field => step.data[field]?.length > 0)) {
                showNotification("Please fill all fields for Twitter Retweet", "info");
                continue;
              }
              response = await AdminService.createTwitterRw({
                quest_id: questId,
                name: step.data.twrw_name,
                desc: step.data.twrw_desc,
                post_link: step.data.twrw_post_link,
              });
              if (response) step.data.id = response.id;
              break;
  
            case "Discord":
              if (!["dc_name", "dc_desc", "dc_invite_link", "dc_guild_id"]
                .every(field => step.data[field]?.length > 0)) {
                showNotification("Please fill all fields for Discord", "info");
                continue;
              }
              response = await AdminService.createDiscord({
                quest_id: questId,
                name: step.data.dc_name,
                desc: step.data.dc_desc,
                invite_link: step.data.dc_invite_link,
                guild_id: step.data.dc_guild_id,
              });
              if (response) step.data.id = response.id;
              break;
  
            case "Custom":
              if (!["custom_name", "custom_desc", "custom_cta", "custom_href", "custom_api"]
                .every(field => step.data[field]?.length > 0)) {
                showNotification("Please fill all fields for Custom", "info");
                continue;
              }
              response = await AdminService.createCustom({
                quest_id: questId,
                name: step.data.custom_name,
                desc: step.data.custom_desc,
                cta: step.data.custom_cta,
                href: step.data.custom_href,
                api: step.data.custom_api,
              });
              if (response) step.data.id = response.id;
              break;
  
            case "Domain":
              response = await AdminService.createDomain({
                quest_id: questId,
                name: step.data.domain_name,
                desc: step.data.domain_desc,
              });
              if (response) step.data.id = response.id;
              break;
  
            case "Balance":
              response = await AdminService.createBalance({
                quest_id: questId,
                name: step.data.balance_name,
                desc: step.data.balance_desc,
                contracts: step.data.balance_contracts,
                cta: step.data.balance_cta,
                href: step.data.balance_href,
              });
              if (response) step.data.id = response.id;
              break;
  
            case "Contract":
              response = await AdminService.createContract({
                quest_id: questId,
                name: step.data.contract_name,
                desc: step.data.contract_desc,
                href: step.data.contract_href,
                cta: step.data.contract_cta,
                calls: JSON.parse(step.data.contract_calls),
              });
              if (response) step.data.id = response.id;
              break;
  
            case "CustomApi":
              response = await AdminService.createCustomApi({
                quest_id: questId,
                name: step.data.api_name,
                desc: step.data.api_desc,
                api_url: step.data.api_url,
                cta: step.data.api_cta,
                href: step.data.api_href,
                regex: step.data.api_regex,
              });
              if (response) step.data.id = response.id;
              break;
          }
        } catch (error) {
          showNotification(`Error adding ${step.type} task: ${error}`, "error");
        }
      }
      setSteps([...steps]);
      setCurrentPage((prev) => prev + 1);
    } finally {
      isSaving.current = false;
      setButtonLoading(false);
    }
  }, [steps, questId]);

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
          setShowDomainPopup={() => { }}
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
          isEdit={false}
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
