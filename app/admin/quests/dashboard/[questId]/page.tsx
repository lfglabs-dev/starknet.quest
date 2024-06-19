"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "@styles/admin.module.css";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import { QuestDefault } from "@constants/common";
import { nft_uri, QuizQuestionDefaultInput, formSteps } from "@constants/admin";
import {
  NFTUri,
  UpdateBoost,
  UpdateQuest,
  UserTask,
} from "../../../../../types/backTypes";
import AdminQuestDetails from "@components/admin/questDetails";
import { useNotification } from "@context/NotificationProvider";
import { getExpireTimeFromJwt } from "@utils/jwt";
import Typography from "@components/UI/typography/typography";
import QuestDetailsForm from "@components/admin/formSteps/QuestDetailsForm";
import RewardDetailsForm from "@components/admin/formSteps/RewardDetailsForm";
import TaskDetailsForm from "@components/admin/formSteps/TaskDetailsForm";
import { TEXT_TYPE } from "@constants/typography";
import FormContainer from "@components/admin/FormContainer";

type AddressOrDomainProps = {
  params: {
    questId: string;
  };
};

type WithNewField<T, K extends string, V> = T & { [P in K]: V };

// Define discriminated union types
type StepMap =
  | { type: "Quiz"; data: WithNewField<QuizInputType, "id", number> }
  | { type: "TwitterFw"; data: WithNewField<TwitterFwInputType, "id", number> }
  | { type: "TwitterRw"; data: WithNewField<TwitterRwInputType, "id", number> }
  | { type: "Discord"; data: WithNewField<DiscordInputType, "id", number> }
  | { type: "Custom"; data: WithNewField<CustomInputType, "id", number> }
  | { type: "Domain"; data: WithNewField<DomainInputType, "id", number> }
  | { type: "None"; data: object };

export default function Page({ params }: AddressOrDomainProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const questId = useRef(parseInt(params.questId));
  const [questInput, setQuestInput] = useState<UpdateQuest>({
    id: Number(params.questId),
  });
  const [nfturi, setNftUri] = useState<NFTUri>(nft_uri);
  const [showBoost, setShowBoost] = useState(false);
  const [boostInput, setBoostInput] = useState<UpdateBoost>({
    id: Number(params.questId),
  });
  const [initialBoostDisplayStatus, setInitialBoostDisplayStatus] =
    useState(false);
  const [intialSteps, setInitialSteps] = useState<StepMap[]>([]);
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
  const [questData, setQuestData] = useState<typeof QuestDefault>(QuestDefault);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const tokenExpiryTime = getExpireTimeFromJwt();
    if (!tokenExpiryTime || tokenExpiryTime < new Date().getTime()) {
      router.push("/admin");
    }
  }, []);

  const fetchPageData = useCallback(async () => {
    try {
      const tokenExpiryTime = getExpireTimeFromJwt();
      if (!tokenExpiryTime || tokenExpiryTime < new Date().getTime()) {
        router.push("/admin");
        return;
      }
      const quest_details = await AdminService.getQuestById(questId.current);
      if (!quest_details) return;
      setStartTime(quest_details.start_time);
      setBoostInput(quest_details.boosts[0]);
      setShowBoost(
        quest_details.boosts[0] ? !quest_details.boosts[0].hidden : false
      );
      setInitialBoostDisplayStatus(
        quest_details.boosts[0] ? !quest_details.boosts[0].hidden : false
      );
      setEndTime(quest_details.expiry);
      setQuestInput(quest_details);
      setQuestData(quest_details);
      const nft_uri_data = await AdminService.getNftUriByQuestId({
        id: questId.current,
      });
      setNftUri(nft_uri_data);
      const quest_tasks = await AdminService.getTasksByQuestId(questId.current);
      const formatted_steps = await tasksFormatter(quest_tasks);
      setInitialSteps(formatted_steps);
      setSteps(formatted_steps);
    } catch (error) {
      console.log("Error while fetching quests", error);
    }
  }, [questId.current]);

  const tasksFormatter = useCallback(async (tasks_details: UserTask[]) => {
    const taskPromises = tasks_details.map(async (task: UserTask) => {
      if (task.task_type === "quiz") {
        if (!task.quiz_name) return;
        const res = await AdminService.getQuizDetails({
          id: task.quiz_name,
        });
        return {
          type: "Quiz",
          data: {
            id: task.id,
            quiz_id: res.id,
            quiz_name: res.name,
            quiz_desc: res.desc,
            quiz_intro: res.intro,
            quiz_cta: task.cta,
            quiz_help_link: task.href,
            questions: res.questions.map(
              (question: typeof QuizQuestionDefaultInput) => {
                return {
                  id: question.id,
                  question: question.question,
                  options: question.options,
                  correct_answers: question.correct_answers,
                };
              }
            ),
          },
        };
      } else if (task.task_type === "twitter_fw") {
        return {
          type: "TwitterFw",
          data: {
            id: task.id,
            twfw_name: task.name,
            twfw_desc: task.desc,
            twfw_username: task?.verify_redirect?.split("=")[1] ?? "",
          },
        };
      } else if (task.task_type === "twitter_rw") {
        return {
          type: "TwitterRw",
          data: {
            id: task.id,
            twrw_name: task.name,
            twrw_desc: task.desc,
            twrw_post_link: task.verify_redirect,
          },
        };
      } else if (task.task_type === "discord") {
        return {
          type: "Discord",
          data: {
            id: task.id,
            dc_name: task.name,
            dc_desc: task.desc,
            dc_guild_id: task.discord_guild_id,
            dc_invite_link: task.href,
          },
        };
      } else if (task.task_type === "custom") {
        return {
          type: "Custom",
          data: {
            id: task.id,
            custom_name: task.name,
            custom_desc: task.desc,
            custom_href: task.href,
            custom_cta: task.cta,
            custom_api: task.verify_endpoint,
          },
        };
      } else if (task.task_type === "domain") {
        return {
          type: "Domain",
          data: {
            id: task.id,
            domain_name: task.name,
            domain_desc: task.desc,
          },
        };
      }
    });

    const res = await Promise.all(taskPromises);
    return res as StepMap[];
  }, []);

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleUpdateQuest = useCallback(async () => {
    try {
      if (!questId.current) return;
      const response = await AdminService.updateQuest(questInput);
      if (!response) return;
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [questInput]);

  const handleUpdateBoost = useCallback(async () => {
    try {
      if (showBoost !== initialBoostDisplayStatus) {
        await AdminService.updateBoost({
          ...boostInput,
          hidden: !showBoost,
        });

        return;
      }
      const response = await AdminService.updateBoost({
        ...boostInput,
        amount: Number(boostInput.amount),
        num_of_winners: Number(boostInput.num_of_winners),
        token_decimals: Number(boostInput.token_decimals),
        token: boostInput.token,
      });

      if (!response) return;
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [boostInput, showBoost]);

  const checkQuestChanges = useCallback(() => {
    const updatedQuest = questData !== questInput;
    return updatedQuest;
  }, [questInput, questData]);

  const checkBoostChanges = useCallback(() => {
    if (showBoost !== initialBoostDisplayStatus) {
      return true;
    }
    if (JSON.stringify(boostInput) !== JSON.stringify(questData?.boosts[0])) {
      return true;
    }
    return false;
  }, [boostInput, questData, initialBoostDisplayStatus, showBoost]);

  const checkStepChanges = useCallback(() => {
    // check which task have been updated

    const filteredSteps = steps.filter((step) => step.type !== "None");

    const updatedTasks = filteredSteps.filter((step, index) => {
      return (
        step?.type !== "None" &&
        intialSteps[index]?.type !== "None" &&
        step?.data?.id &&
        step?.data?.id !== 0 &&
        step.data !== intialSteps[index]?.data
      );
    });

    // check which tasks have been removed
    const removedTasks = intialSteps.filter((step) => {
      return (
        step.type !== "None" &&
        !filteredSteps.some(
          (filteredStep) => filteredStep.data.id === step.data.id
        )
      );
    });

    // check which tasks have been added
    const addedTasks = filteredSteps.filter((step) => {
      return (
        step.type !== "None" &&
        !intialSteps.some((intialStep) => intialStep.data.id === step.data.id)
      );
    });

    return { updatedTasks, removedTasks, addedTasks };
  }, [steps, intialSteps]);

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
    if (new Date(startTime).getTime() < new Date().getTime()) {
      showNotification("Start time cannot be less than current time", "info");
      return;
    }

    setQuestInput((prev) => ({
      ...prev,
      start_time: new Date(startTime).getTime(),
    }));
  }, [startTime]);

  useEffect(() => {
    // check if start_time is less than end_time
    if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
      showNotification("End time cannot be less than start time", "info");
      return;
    }
    setQuestInput((prev) => ({
      ...prev,
      expiry: new Date(endTime).getTime(),
    }));
    setBoostInput((prev) => ({
      ...prev,
      expiry: new Date(endTime).getTime(),
    }));
  }, [endTime]);

  const handlePublishQuest = useCallback(
    async (value: boolean) => {
      await AdminService.updateQuest({
        id: questId.current,
        disabled: value,
      });
    },
    [questId]
  );

  const handleTaskChanges = useCallback(async () => {
    const { updatedTasks, removedTasks, addedTasks } = checkStepChanges();

    // update tasks
    await handleUpdateTasks(updatedTasks);

    //
    await handleDeleteTasks(removedTasks);

    // add tasks
    await handleAddTasks(addedTasks);

    setCurrentPage((prev) => prev + 1);
  }, [steps, intialSteps]);

  const handleCreateBoost = useCallback(async () => {
    try {
      if (!showBoost) return;
      if (
        !boostInput ||
        !boostInput.token ||
        !boostInput.amount ||
        !boostInput.num_of_winners ||
        !boostInput.token_decimals
      )
        return;

      const response = await AdminService.createBoost({
        name: questInput.name ?? questData.name,
        quest_id: questId.current,
        amount: Number(boostInput.amount),
        num_of_winners: Number(boostInput.num_of_winners),
        token_decimals: boostInput.token_decimals,
        token: boostInput.token,
        img_url: boostInput.img_url ?? questData.img_card,
        expiry: new Date(endTime).getTime(),
        hidden: showBoost,
      });
      if (!response) return;
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [questId, boostInput]);

  const handleQuestBoostNftChanges = async () => {
    setButtonLoading(true);
    if (checkQuestChanges()) {
      await handleUpdateQuest();
    }
    if (checkBoostChanges()) {
      if (boostInput.id) {
        await handleUpdateBoost();
      } else {
        await handleCreateBoost();
      }
    }
    setButtonLoading(false);
    setCurrentPage((prev) => prev + 1);
  };

  const handleAddTasks = useCallback(async (addedTasks: StepMap[]) => {
    const taskPromises = addedTasks.map(async (step) => {
      if (step.type === "Quiz") {
        await AdminService.createQuiz({
          quest_id: questId.current,
          name: step.data.quiz_name,
          desc: step.data.quiz_desc,
          intro: step.data.quiz_intro,
          cta: step.data.quiz_cta,
          help_link: step.data.quiz_help_link,
        });
        for (const question of step.data.questions) {
          try {
            await AdminService.createQuizQuestion({
              quiz_id: step.data.quiz_name,
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
        await AdminService.createTwitterFw({
          quest_id: questId.current,
          name: step.data.twfw_name,
          desc: step.data.twfw_desc,
          username: step.data.twfw_username,
        });
      } else if (step.type === "TwitterRw") {
        await AdminService.createTwitterRw({
          quest_id: questId.current,
          name: step.data.twrw_name,
          desc: step.data.twrw_desc,
          post_link: step.data.twrw_post_link,
        });
      } else if (step.type === "Discord") {
        await AdminService.createDiscord({
          quest_id: questId.current,
          name: step.data.dc_name,
          desc: step.data.dc_desc,
          invite_link: step.data.dc_invite_link,
          guild_id: step.data.dc_guild_id,
        });
      } else if (step.type === "Custom") {
        await AdminService.createCustom({
          quest_id: questId.current,
          name: step.data.custom_name,
          desc: step.data.custom_desc,
          cta: step.data.custom_cta,
          href: step.data.custom_href,
          api: step.data.custom_api,
        });
      } else if (step.type === "Domain") {
        await AdminService.createDomain({
          quest_id: questId.current,
          name: step.data.domain_name,
          desc: step.data.domain_desc,
        });
      }
    });

    await Promise.all(taskPromises);
  }, []);

  const handleDeleteTasks = useCallback(async (removedTasks: StepMap[]) => {
    const taskPromises = removedTasks.map(async (step) => {
      await AdminService.deleteTask({
        id: step.data.id,
      });
    });

    await Promise.all(taskPromises);
  }, []);

  const handleUpdateTasks = useCallback(async (updatedSteps: StepMap[]) => {
    const taskPromises = updatedSteps.map(async (step) => {
      if (step.type === "Quiz") {
        await AdminService.updateQuiz({
          id: step.data.id,
          name: step.data.quiz_name,
          desc: step.data.quiz_desc,
          intro: step.data.quiz_intro,
          cta: step.data.quiz_cta,
          help_link: step.data.quiz_help_link,
          quiz_id: step.data.quiz_id,
        });

        for (const question of step.data.questions) {
          try {
            if (question.id === 0) {
              await AdminService.createQuizQuestion({
                quiz_id: step.data.quiz_id,
                question: question.question,
                options: question.options,
                correct_answers: question.correct_answers,
              });
            }
            await AdminService.updateQuizQuestion({
              id: question.id,
              question: question.question,
              options: question.options,
              correct_answers: question.correct_answers,
              quiz_id: step.data.quiz_id,
            });
          } catch (error) {
            console.error("Error executing promise:", error);
          }
        }
      }
      if (step.type === "TwitterFw") {
        await AdminService.updateTwitterFw({
          id: step.data.id,
          name: step.data.twfw_name,
          desc: step.data.twfw_desc,
          username: step.data.twfw_username,
        });
      } else if (step.type === "TwitterRw") {
        await AdminService.updateTwitterRw({
          id: step.data.id,
          name: step.data.twrw_name,
          desc: step.data.twrw_desc,
          post_link: step.data.twrw_post_link,
        });
      } else if (step.type === "Discord") {
        await AdminService.updateDiscord({
          id: step.data.id,
          name: step.data.dc_name,
          desc: step.data.dc_desc,
          invite_link: step.data.dc_invite_link,
          guild_id: step.data.dc_guild_id,
        });
      } else if (step.type === "Custom") {
        await AdminService.updateCustom({
          id: step.data.id,
          name: step.data.custom_name,
          desc: step.data.custom_desc,
          cta: step.data.custom_cta,
          href: step.data.custom_href,
          api: step.data.custom_api,
        });
      } else if (step.type === "Domain") {
        await AdminService.updateDomain({
          id: step.data.id,
          name: step.data.custom_name,
          desc: step.data.custom_desc,
        });
      }
    });

    await Promise.all(taskPromises);
  }, []);

  const isButtonDisabled = useMemo(() => {
    const boostInputValid =
      !boostInput?.amount || !boostInput?.num_of_winners || !boostInput?.token;

    const nftUriValid = !nfturi?.name || !nfturi?.image;

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
          onSubmit={async () => await handleQuestBoostNftChanges()}
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
            await handleTaskChanges();
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
      if (questData.id === 0) {
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
          quest={questData}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          setShowDomainPopup={() => {}}
          hasRootDomain={false}
          rewardButtonTitle={questData.disabled ? "Enable" : "Disable"}
          onRewardButtonClick={async () => {
            await handlePublishQuest(!questData.disabled);
            await fetchPageData();
          }}
          overrideDisabledState={false}
        />
      );
    }
  };

  return (
    <div className={styles.layout_screen}>
      <FormContainer
        headingText="Edit Quest"
        steps={formSteps}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      >
        {questData.id !== 0 ? (
          renderFormStep()
        ) : (
          <div className="flex justify-center items-center flex-1">
            <p className={styles.screenHeadingText}>Loading...</p>
          </div>
        )}
      </FormContainer>
    </div>
  );
}
