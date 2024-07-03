import { getCurrentNetwork } from "@utils/network";
import { TOKEN_ADDRESS_MAP, TOKEN_DECIMAL_MAP } from "./common";

export const CATEGORY_OPTIONS = [
  "DeFi",
  "Dapps",
  "NFTs",
  "Gaming",
  "Starknet Pro Score by Braavos",
];

export const formSteps = ["Setup", "Reward", "Tasks", "Preview"];

export const TASK_OPTIONS = ["Quiz", "Twitter", "Discord", "Custom", "Domain"];

export const TWITTER_OPTIONS = {
  "Follow on Twitter": "TwitterFw",
  "Retweet on Twitter": "TwitterRw",
};

export const NUMBER_OF_QUESTIONS = 3;

export const questDefaultInput = {
  name: "",
  desc: "",
  category: "Defi",
  logo: "",
  rewards_title: "",
  rewards_img: "",
  disabled: false,
  start_time: parseInt(Date.now().toString()),
  expiry: null,
  img_card: "",
  title_card: "",
  issuer: "",
};

export const nft_uri = {
  name: "",
  description: "",
  image: "",
};

export const boostDefaultInput = {
  amount: 0,
  token: TOKEN_ADDRESS_MAP[getCurrentNetwork()].USDC,
  num_of_winners: 0,
  token_decimals: TOKEN_DECIMAL_MAP.USDC,
  name: "",
  img_url: "",
  expiry: 0,
  hidden: true,
};

export const QuizQuestionDefaultInput = {
  id: 0,
  question: "",
  options: ["", "", "", ""],
  correct_answers: [1],
};

export const QuizDefaultInput = {
  quiz_name: "",
  quiz_desc: "",
  quiz_help_link: "",
  quiz_cta: "",
  quiz_intro: "",
  questions: [QuizQuestionDefaultInput],
};

export const TwitterFwInput = {
  twfw_name: "",
  twfw_desc: "",
  twfw_username: "",
};

export const TwitterRwInput = {
  twrw_name: "",
  twrw_desc: "",
  twrw_post_link: "",
};

export const DiscordInput = {
  dc_name: "",
  dc_desc: "",
  dc_invite_link: "",
  dc_guild_id: "",
};

export const CustomInput = {
  custom_name: "",
  custom_desc: "",
  custom_cta: "",
  custom_href: "",
  custom_api: "",
};

export const DomainInput = {
  domain_name: "",
  domain_desc: "",
};

export const getDefaultValues = (type: TaskType) => {
  if (type === "Quiz") return QuizDefaultInput;
  if (type === "TwitterFw") return TwitterFwInput;
  if (type === "TwitterRw") return TwitterRwInput;
  if (type === "Discord") return DiscordInput;
  if (type === "Custom") return CustomInput;
  if (type === "Domain") return DomainInput;
  if (type === "None") return {};

  return QuizDefaultInput;
};
