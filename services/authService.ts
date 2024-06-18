import {
  CreateBoost,
  CreateCustom,
  CreateDiscord,
  CreateDomain,
  CreateQuest,
  CreateQuiz,
  CreateQuizQuestion,
  CreateTwitterFw,
  CreateTwitterRw,
  UpdateBoost,
  UpdateCustom,
  UpdateDiscord,
  UpdateDomain,
  UpdateQuest,
  UpdateQuiz,
  UpdateQuizQuestion,
  UpdateTwitterFw,
  UpdateTwitterRw,
  CreateNftUri,
  UpdateNftUri,
} from "../types/backTypes";

const baseurl = process.env.NEXT_PUBLIC_API_LINK;

const login = async (params: { passcode: string }) => {
  try {
    const { passcode } = params;
    const response = await fetch(`${baseurl}/admin/login?code=${passcode}`);
    return await response.json();
  } catch (err) {
    console.log("Error while logging in", err);
    return null;
  }
};

const getNftUriByQuestId = async (params: { id: number }) => {
  try {
    const response = await fetch(
      `${baseurl}/admin/nft_uri/get_nft_uri?id=${params.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log("Error while getting nft uri by quest id", err);
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
    console.log("Error while getting quests by id", err);
  }
};

const getTasksByQuestId = async (id: number) => {
  try {
    const response = await fetch(
      `${baseurl}/admin/quest/get_tasks?quest_id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log("Error while getting tasks by id", err);
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
    console.log("Error while getting quests", err);
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
    console.log("Error while creating quest", err);
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
    console.log("Error while updating quest", err);
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
    console.log("Error while creating boost", err);
  }
};

const updateBoost = async (params: UpdateBoost) => {
  try {
    const response = await fetch(`${baseurl}/admin/quest_boost/update_boost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while updating boost", err);
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
    console.log("Error while creating twitter fw task", err);
  }
};

const updateTwitterFw = async (params: UpdateTwitterFw) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/twitter_fw/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while updating twitter fw task", err);
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
    console.log("Error while creating twitter rw task", err);
  }
};

const createDomain = async (params: CreateDomain) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/domain/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while creating domain task", err);
  }
};

const updateDomain = async (params: UpdateDomain) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/domain/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while updating domain task", err);
  }
};

const updateTwitterRw = async (params: UpdateTwitterRw) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/twitter_rw/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while updating twitter rw task", err);
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
    console.log("Error while creating discord task", err);
  }
};

const updateDiscord = async (params: UpdateDiscord) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/discord/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while updating discord task", err);
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
    console.log("Error while creating custom task", err);
  }
};

const updateCustom = async (params: UpdateCustom) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/custom/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while updating custom task", err);
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
    console.log("Error while creating quiz", err);
  }
};

const updateQuiz = async (params: UpdateQuiz) => {
  try {
    const response = await fetch(`${baseurl}/admin/tasks/quiz/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while updating quiz", err);
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
    console.log("Error while creating quiz question", err);
  }
};

const updateQuizQuestion = async (params: UpdateQuizQuestion) => {
  try {
    const response = await fetch(
      `${baseurl}/admin/tasks/quiz/question/update`,
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
    console.log("Error while updating quiz question", err);
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
    console.log("Error while deleting tasks", err);
  }
};

const getQuizDetails = async (params: { id: number }) => {
  try {
    const response = await fetch(
      `${baseurl}/admin/quiz/get_quiz?id=${params.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log("Error while getting quiz details", err);
  }
};

const createNftUri = async (params: CreateNftUri) => {
  try {
    const response = await fetch(`${baseurl}/admin/nft_uri/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while creating nft uri", err);
  }
};

const updateNftUri = async (params: UpdateNftUri) => {
  try {
    const response = await fetch(`${baseurl}/admin/nft_uri/update`, {
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
  updateBoost,
  updateTwitterRw,
  updateTwitterFw,
  updateQuizQuestion,
  updateQuiz,
  updateCustom,
  updateDiscord,
  getNftUriByQuestId,
  getQuizDetails,
  updateDomain,
  createDomain,
  createNftUri,
  updateNftUri,
};
