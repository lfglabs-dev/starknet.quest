"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  SetStateAction,
} from "react";
import styles from "@styles/admin.module.css";
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
import BannerDetailsForm from "@components/admin/formSteps/BannerDetailsForm";
import { TEXT_TYPE } from "@constants/typography";
import FormContainer from "@components/admin/FormContainer";
import { useRouter, useSearchParams } from "next/navigation";

type QuestIdProps = {
  params: {
    questId: string;
  };
};

// This utility in TypeScript extends a type by adding a new field with key K and value type V.
type WithNewField<T, K extends string, V> = T & { [P in K]: V };

// Define discriminated union types
type StepMap =
  | { type: "Quiz"; data: WithNewField<QuizInputType, "id", number> }
  | { type: "TwitterFw"; data: WithNewField<TwitterFwInputType, "id", number> }
  | { type: "TwitterRw"; data: WithNewField<TwitterRwInputType, "id", number> }
  | { type: "Discord"; data: WithNewField<DiscordInputType, "id", number> }
  | { type: "Custom"; data: WithNewField<CustomInputType, "id", number> }
  | { type: "Domain"; data: WithNewField<DomainInputType, "id", number> }
  | { type: "Balance"; data: WithNewField<BalanceInputType, "id", number> }
  | { type: "Contract"; data: WithNewField<ContractInputType, "id", number> }
  | { type: "CustomApi"; data: WithNewField<CustomApiInputType, "id", number> }
  | { type: "None"; data: object };

export default function Page({ params }: QuestIdProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    const tabParam = searchParams.get("tab");
    return tabParam ? parseInt(tabParam) : 0;
  });
  const handleTabChange = (pageOrUpdater: SetStateAction<number>) => {
    // If it's a function, calculate the new page value
    const newPage =
      typeof pageOrUpdater === "function"
        ? pageOrUpdater(currentPage)
        : pageOrUpdater;

    setCurrentPage(newPage);
    router.push(`?tab=${newPage}`, { scroll: false });
  };
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
    if (!params || !params.questId) {
      showNotification("Invalid or missing quest ID.", "error");
      return;
    }
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
      showNotification("Failed to update quest. Please try again.", "error");
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
      } else if (task.task_type === "balance") {
        return {
          type: "Balance",
          data: {
            id: task.id,
            balance_name: task.name,
            balance_desc: task.desc,
            balance_contracts: task.contracts,
            balance_cta: task.cta,
            balance_href: task.href,
          },
        };
      } else if (task.task_type === "contract") {
        return {
          type: "Contract",
          data: {
            id: task.id,
            contract_name: task.name,
            contract_desc: task.desc,
            contract_href: task.href,
            contract_cta: task.cta,
            contract_calls: task.calls,
          },
        };
      } else if (task.task_type === "custom_api") {
        return {
          type: "CustomApi",
          data: {
            id: task.id,
            api_name: task.name,
            api_desc: task.desc,
            api_href: task.href,
            api_url: task.api_url,
            api_cta: task.cta,
            api_regex: task.regex,
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
          amount: Number(boostInput.amount),
          num_of_winners: Number(boostInput.num_of_winners),
          token_decimals: Number(boostInput.token_decimals),
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
      return !intialSteps.some(
        (intialStep) => intialStep.data.id === step.data.id
      );
    });

    return { updatedTasks, removedTasks, addedTasks };
  }, [steps, intialSteps]);

  const handleQuestInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const nameSplit = name.split(".");

      setQuestInput((prev) => {
        const updated = { ...prev };
        let current: any = updated;

        for (let i = 0; i < nameSplit.length - 1; i++) {
          if (!current[nameSplit[i]]) {
            current[nameSplit[i]] = {};
          }
          current = current[nameSplit[i]];
        }

        current[nameSplit[nameSplit.length - 1]] = value;
        return updated;
      });
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
    // check if start_time is less than end_time
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

    handleTabChange(currentPage + 1);
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
    handleTabChange(currentPage + 1);
  };

  const handleAddTasks = useCallback(async (addedTasks: StepMap[]) => {
    const taskPromises = addedTasks.map(async (step) => {
      try {
        switch (step.type) {
          case "Quiz":
            await AdminService.createQuiz({
              quest_id: questId.current,
              name: step.data.quiz_name,
              desc: step.data.quiz_desc,
              intro: step.data.quiz_intro,
              cta: step.data.quiz_cta,
              help_link: step.data.quiz_help_link,
            });

            const quizQuestionPromises = step.data.questions.map(
              async (question: any) =>
                AdminService.createQuizQuestion({
                  quiz_id: step.data.quiz_name,
                  question: question.question,
                  options: question.options,
                  correct_answers: question.correct_answers,
                })
            );
            await Promise.all(quizQuestionPromises);
            break;

          case "TwitterFw":
            await AdminService.createTwitterFw({
              quest_id: questId.current,
              name: step.data.twfw_name,
              desc: step.data.twfw_desc,
              username: step.data.twfw_username,
            });
            break;

          case "TwitterRw":
            await AdminService.createTwitterRw({
              quest_id: questId.current,
              name: step.data.twrw_name,
              desc: step.data.twrw_desc,
              post_link: step.data.twrw_post_link,
            });
            break;

          case "Discord":
            await AdminService.createDiscord({
              quest_id: questId.current,
              name: step.data.dc_name,
              desc: step.data.dc_desc,
              invite_link: step.data.dc_invite_link,
              guild_id: step.data.dc_guild_id,
            });
            break;

          case "Custom":
            await AdminService.createCustom({
              quest_id: questId.current,
              name: step.data.custom_name,
              desc: step.data.custom_desc,
              cta: step.data.custom_cta,
              href: step.data.custom_href,
              api: step.data.custom_api,
            });
            break;

          case "Domain":
            await AdminService.createDomain({
              quest_id: questId.current,
              name: step.data.domain_name,
              desc: step.data.domain_desc,
            });
            break;

          case "Balance":
            await AdminService.createBalance({
              quest_id: questId.current,
              name: step.data.balance_name,
              desc: step.data.balance_desc,
              contracts: step.data.balance_contracts,
              cta: step.data.balance_cta,
              href: step.data.balance_href,
            });
            break;

          case "Contract":
            await AdminService.createContract({
              quest_id: questId.current,
              name: step.data.contract_name,
              desc: step.data.contract_desc,
              href: step.data.contract_href,
              cta: step.data.contract_cta,
              calls: JSON.parse(step.data.contract_calls),
            });
            break;

          case "CustomApi":
            await AdminService.createCustomApi({
              quest_id: questId.current,
              name: step.data.api_name,
              desc: step.data.api_desc,
              api_url: step.data.api_url,
              regex: step.data.api_regex,
              href: step.data.api_href,
              cta: step.data.api_cta,
            });
            break;
        }
      } catch (error) {
        showNotification(`Error adding ${step.type} task: ${error}`, "error");
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
      try {
        switch (step.type) {
          case "Quiz":
            await AdminService.updateQuiz({
              id: step.data.id,
              name: step.data.quiz_name,
              desc: step.data.quiz_desc,
              intro: step.data.quiz_intro,
              cta: step.data.quiz_cta,
              help_link: step.data.quiz_help_link,
              quiz_id: step.data.quiz_id,
            });

            const quizQuestionPromises = step.data.questions.map(
              async (question: any) => {
                if (question.id === 0) {
                  await AdminService.createQuizQuestion({
                    quiz_id: step.data.quiz_id,
                    question: question.question,
                    options: question.options,
                    correct_answers: question.correct_answers,
                  });
                }
                return AdminService.updateQuizQuestion({
                  id: question.id,
                  question: question.question,
                  options: question.options,
                  correct_answers: question.correct_answers,
                  quiz_id: step.data.quiz_id,
                });
              }
            );
            await Promise.all(quizQuestionPromises);
            break;

          case "TwitterFw":
            await AdminService.updateTwitterFw({
              id: step.data.id,
              name: step.data.twfw_name,
              desc: step.data.twfw_desc,
              username: step.data.twfw_username,
            });
            break;

          case "TwitterRw":
            await AdminService.updateTwitterRw({
              id: step.data.id,
              name: step.data.twrw_name,
              desc: step.data.twrw_desc,
              post_link: step.data.twrw_post_link,
            });
            break;

          case "Discord":
            await AdminService.updateDiscord({
              id: step.data.id,
              name: step.data.dc_name,
              desc: step.data.dc_desc,
              invite_link: step.data.dc_invite_link,
              guild_id: step.data.dc_guild_id,
            });
            break;

          case "Custom":
            await AdminService.updateCustom({
              id: step.data.id,
              name: step.data.custom_name,
              desc: step.data.custom_desc,
              cta: step.data.custom_cta,
              href: step.data.custom_href,
              api: step.data.custom_api,
            });
            break;

          case "Domain":
            await AdminService.updateDomain({
              id: step.data.id,
              name: step.data.custom_name,
              desc: step.data.custom_desc,
            });
            break;

          case "Balance":
            await AdminService.updateBalance({
              id: step.data.id,
              name: step.data.balance_name,
              desc: step.data.balance_desc,
              contracts: step.data.balance_contracts,
              cta: step.data.balance_cta,
              href: step.data.balance_href,
            });
            break;

          case "Contract":
            await AdminService.updateContract({
              id: step.data.id,
              name: step.data.contract_name,
              desc: step.data.contract_desc,
              href: step.data.contract_href,
              cta: step.data.contract_cta,
              calls: JSON.parse(step.data.contract_calls),
            });
            break;

          case "CustomApi":
            await AdminService.updateCustomApi({
              id: step.data.id,
              name: step.data.api_name,
              desc: step.data.api_desc,
              api_url: step.data.api_url,
              cta: step.data.api_cta,
              href: step.data.api_href,
              regex: step.data.api_regex,
            });
            break;
        }
      } catch (error) {
        showNotification(`Error updating ${step.type} task: ${error}`, "error");
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
      !questInput.category;

    const questRewardValid = !questInput.rewards_title || !questInput.logo;

    const bannerValid =
      !questInput.banner?.tag ||
      !questInput.banner?.title ||
      !questInput.banner?.description ||
      !questInput.banner?.cta ||
      !questInput.banner?.href ||
      !questInput.banner?.image;

    if (currentPage === 0) {
      return questInputValid;
    } else if (currentPage === 1) {
      return (showBoost && boostInputValid) || nftUriValid || questRewardValid;
    } else if (currentPage === 2) {
      return steps.some((step) => step.type === "None");
    } else if (currentPage === 3) {
      return bannerValid;
    }

    return false;
  }, [
    currentPage,
    questInput,
    questInput.banner,
    nfturi,
    steps,
    showBoost,
    boostInput,
    startTime,
    endTime,
  ]);

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
          onSubmit={() => handleTabChange(currentPage + 1)}
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
      return (
        <BannerDetailsForm
          setQuestInput={setQuestInput}
          questInput={questInput}
          handleQuestInputChange={handleQuestInputChange}
          submitButtonDisabled={isButtonDisabled}
          onSubmit={async () => {
            await handleUpdateQuest();
            showNotification("Banner updated successfully", "success");
            setCurrentPage((prev) => prev + 1);
          }}
        />
      );
    } else if (currentPage === 4) {
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
          setShowDomainPopup={() => {}}
          hasRootDomain={false}
          rewardButtonTitle="Analytics"
          onRewardButtonClick={() => {
            const analyticsUrl = `/analytics/${questData.id}`;
            window.open(analyticsUrl, "_blank");
          }}
          overrideDisabledState={false}
          isEdit={true}
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
        setCurrentPage={handleTabChange}
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
