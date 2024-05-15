type CreateQuest = {
  name: string;
  desc: string;
  start_time: number;
  expiry: number | null;
  disabled: boolean;
  category: string;
  logo?: string;
  rewards_img?: string;
  rewards_title?: string;
};
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

const getQuests = async () => {
  try {
    const response = await fetch(`${baseurl}/admin/get_quests`, {
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while quests", err);
  }
};

export const AdminService = { login, getQuests, createQuest };
