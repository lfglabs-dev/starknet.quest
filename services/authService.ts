import {
  CreateBoost,
  CreateCustom,
  CreateDiscord,
  CreateQuest,
  CreateQuiz,
  CreateQuizQuestion,
  CreateTwitterFw,
  CreateTwitterRw,
  UpdateQuest,
} from "../types/backTypes";

const baseurl = process.env.NEXT_PUBLIC_API_LINK;

const login = async (params: { passcode: string }) => {
  try {
    const { passcode } = params;
    const response = await fetch(`${baseurl}/admin/login?code=${passcode}`);
    return await response.json();
  } catch (err) {
    console.log("Error while logging in", err);
  }
};

const getQuestById = async (id: number) => {
  try {
    const response = await fetch(`${baseurl}/admin/quest/get_quest?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const getTasksByQuestId = async (id: number) => {
  try {
    const response = await fetch(`${baseurl}/admin/quest/get_tasks?quest_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};
const getQuests = async () => {
  try {
    const response = await fetch(`${baseurl}/admin/quest/get_quests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const createQuest = async (params: CreateQuest) => {
  try {
    const response = await fetch(`${baseurl}/admin/quest/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const updateQuest = async (params: UpdateQuest) => {
  try {
    const response = await fetch(`${baseurl}/admin/quest/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const createBoost = async (params: CreateBoost) => {
  try {
    const response = await fetch(`${baseurl}/admin/quest_boost/create_boost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const createTwitterFw = async (params: CreateTwitterFw) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/twitter_fw/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const createTwitterRw = async (params: CreateTwitterRw) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/twitter_rw/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const createDiscord = async (params: CreateDiscord) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/discord/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const createCustom = async (params: CreateCustom) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/custom/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const createQuiz = async (params: CreateQuiz) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/quiz/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const createQuizQuestion = async (params: CreateQuizQuestion) => {
  try {
    const response = await fetch(
      `${baseurl}/admin/tasks/quiz/question/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(params),
      }
    );
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

const deleteTask = async (params: { id: number }) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/remove_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

export const AdminService = {
  login,
  getQuests,
  createQuest,
  createBoost,
  createTwitterFw,
  createTwitterRw,
  createDiscord,
  createCustom,
  createQuiz,
  createQuizQuestion,
  deleteTask,
  updateQuest,
  getQuestById,
  getTasksByQuestId,
};
