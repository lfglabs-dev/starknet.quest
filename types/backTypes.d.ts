type QueryError = { error: string };

type QuestDocument = {
  id: number;
  name: string;
  desc: string;
  issuer: string;
  category: string;
  rewards_endpoint: string;
  logo: string;
  rewards_img: string;
  rewards_title: string;
  rewards_nfts: NFTItem[];
  img_card: string;
  title_card: string;
  hidden: boolean;
  disabled: boolean;
  expiry_timestamp: string | null;
  start_timestamp: string | null;
  mandatory_domain: string | null;
  expired: boolean;
  visible: boolean;
  rewards_description: string | null;
  additional_desc: string | null;
};

type ClaimableQuestDocument = QuestDocument & {
  boostId: number;
};

type NFTItem = {
  img: string;
  level: number;
};

type UserTask = {
  id: number;
  quest_id: number;
  name: string;
  desc: string;
  href: string;
  cta?: string;
  api_url?: string;
  regex?: string;
  verify_endpoint: string;
  verify_endpoint_type: string;
  verify_redirect: string | null;
  completed: boolean;
  quiz_name: number | null;
  task_type: string | null;
  discord_guild_id: string | null;
  contracts: string[] | null;
  calls: object | null;
};

type UserDocument = {
  address: string;
  exp: number;
};

type CompletedTaskDocument = {
  task_id: number;
  address: string;
};

export interface RequestProps {
  query: {
    address: string;
  };
}

export type CustomNextApiRequest = NextApiRequest & RequestProps;

export type RequestResponse = {
  res: boolean;
  error_msg?: string;
};

type RequestProps = {
  address: string;
};
export interface TwitterRequestProps {
  query: {
    id: string;
  };
}

export type CustomTwitterNextApiRequest = NextApiRequest & TwitterRequestProps;

type AchievementsDocument = {
  category_id: number;
  category_name: string;
  category_desc: string;
  category_img_url: string;
  category_type: string;
  category_override_verified_type: string | null;
  achievements: AchievementDocument[];
};

type AchievementDocument = {
  id: number;
  name: string;
  short_desc: string;
  title: string;
  desc: string;
  completed: boolean;
  img_url: string;
  verify_type: string;
};

type CompletedDocument = {
  achieved: number[];
};

type DeployedTime = {
  timestamp: number;
};

type QuestCategoryDocument = {
  name: string;
  title: string;
  desc: string;
  img_url: string;
};

type QuestParticipation = {
  name: string;
  desc: string;
  count: number;
}[];

type QuizQuestionDocument = {
  kind: "text_choice" | "image_choice" | "ordering";
  layout: "default" | "illustrated_left";
  question: string;
  options: string[];
  image_for_layout: string | null;
};

export type QuizDocument = {
  name: string;
  desc: string;
  questions: QuizQuestionDocument[];
};

type QuestActivityData = {
  date: string;
  participants: number;
};

type BoostedQuests = number[];

type UniqueVisitorCount = number;

type LeaderboardToppersData = {
  best_users: { address: string; xp: number; achievements: number }[];
  total_users: number;
  position?: number;
};

type LeaderboardRankings = {
  ranking: Ranking[];
  first_elt_position: number;
};

type Ranking = {
  address: string;
  xp: number;
  achievements: number;
};

type CompletedQuests = number[];

type QuestParticipantsDocument = {
  count: string | number;
  firstParticipants: string[];
};

type UniquePageVisit = {
  res: boolean;
};

type PendingBoostClaim = {
  amount: number;
  token: string;
  expiry: number;
  quests: number[];
  winner: string;
  img_url: string;
  id: number;
  name: string;
  num_of_winners: number;
  token_decimals: number;
};

type BoostClaimParams = {
  address: string;
  r: string;
  s: string;
};

type LeaderboardTopperParams = {
  addr: string;
  duration: "week" | "month" | "all";
};

type LeaderboardRankingParams = {
  addr: string;
  page_size: number;
  shift: number;
  duration: "week" | "month" | "all";
};

type derivateStats = {
  [key: string]: {
    date: string;
    protocol: string;
    allocation: number;
    tvl: number;
    volumes: number;
    beta_fees: number;
    apr: number;
  };
};

type altProtocolStats = {
  [key: string]: {
    [sub_key: string]: {
      date: string;
      allocation: number;
      tvl_usd: number;
      apr: number;
    };
  };
};

type pairStats = {
  [key: string]: {
    [sub_key: string]: {
      date: string;
      allocation: number;
      token0_allocation: number;
      token1_allocation: number;
      thirty_day_realized_volatility: number;
      tvl_usd: number;
      apr: number;
    };
  };
};

type lendStats = {
  [key: string]: {
    [sub_key: string]: {
      date: string;
      allocation: number;
      supply_usd: number;
      non_recursive_supply_usd: number;
      non_recursive_revenue_usd: number;
      strk_grant_apr_ts: number;
      strk_grant_apr_nrs: number;
    };
  };
};

type QuestList = {
  [key: string]: QuestDocument[];
};

export type CreateQuest = {
  name: string;
  desc: string;
  start_time: number;
  expiry: number | null;
  disabled: boolean;
  category: string;
  logo: string;
  rewards_img: string;
  rewards_title: string;
  img_card: string;
  title_card: string;
  issuer: string;
};

export type UpdateQuest = {
  id: number;
  name?: string;
  desc?: string;
  start_time?: number;
  expiry?: number | null;
  disabled?: boolean;
  category?: string;
  logo?: string;
  rewards_img?: string;
  rewards_title?: string;
  img_card?: string;
  title_card?: string;
  issuer?: string;
};

export type CreateBoost = {
  amount: number;
  token: string;
  num_of_winners: number;
  token_decimals: number;
  name: string;
  img_url: string;
  expiry: number;
  quest_id: number;
  hidden: boolean;
};

export type UpdateBoost = {
  id: number;
  amount?: number;
  token?: string;
  num_of_winners?: number;
  token_decimals?: number;
  name?: string;
  img_url?: string;
  expiry?: number;
  quest_id?: number;
  hidden?: boolean;
};

export type CreateTwitterFw = {
  name: string;
  desc: string;
  username: string;
  quest_id: number;
};

export type UpdateTwitterFw = {
  name?: string;
  desc?: string;
  username?: string;
  id: number;
};

export type CreateTwitterRw = {
  name: string;
  desc: string;
  post_link: string;
  quest_id: number;
};

export type CreateDomain = {
  name: string;
  desc: string;
  quest_id: number;
};

export type UpdateDomain = {
  name: string;
  desc: string;
  id: number;
};

export type UpdateTwitterRw = {
  name?: string;
  desc?: string;
  post_link?: string;
  id: number;
};

export type CreateDiscord = {
  quest_id: number;
  name: string;
  desc: string;
  invite_link: string;
  guild_id: string;
};

export type UpdateDiscord = {
  id: number;
  name?: string;
  desc?: string;
  invite_link?: string;
  guild_id?: string;
};

export type CreateCustom = {
  quest_id: number;
  name: string;
  desc: string;
  cta: string;
  href: string;
  api: string;
};

export type CreateBalance = {
  quest_id: number;
  name: string;
  desc: string;
  contracts: string[];
  cta: string;
  href: string;
};

export type UpdateBalance = {
  id: number;
  name?: string;
  desc?: string;
  contracts?: string[];
  cta?: string;
  href?: string;
};

export type CreateContract = {
  quest_id: number;
  name: string;
  desc: string;
  href: string;
  cta: string;
  calls: object;
};

export type UpdateContract = {
  id: number;
  name?: string;
  desc?: string;
  href?: string;
  cta?: string;
  calls?: object;
};

export type UpdateCustom = {
  id: number;
  name?: string;
  desc?: string;
  cta?: string;
  href?: string;
  api?: string;
};

export type CreateQuiz = {
  name: string;
  desc: string;
  help_link: string;
  cta: string;
  intro: string;
  quest_id: number;
};

export type UpdateQuiz = {
  name?: string;
  desc?: string;
  help_link?: string;
  cta?: string;
  intro?: string;
  id: number;
  quiz_id: number;
};

export type CreateQuizQuestion = {
  question: string;
  options: string[];
  correct_answers: number[];
  quiz_id: number;
};

export type UpdateQuizQuestion = {
  question: string;
  options: string[];
  correct_answers: number[];
  id: number;
  quiz_id: number;
};

export type NFTUri = {
  name: string;
  description: string;
  image: string;
};

export type CreateNftUri = {
  name: string;
  desc: string;
  image: string;
  quest_id: number;
};

export type UpdateNftUri = {
  name: string;
  desc: string;
  image: string;
  id: number;
};

export type AddUser = {
  user: string;
  password: string;
};

export type CreateCustomApi = {
  quest_id: number;
  name: string;
  desc: string;
  href: string;
  cta: string;
  api_url?: string;
  regex?: string;
};

export type UpdateCustomApi = {
  id: number;
  name?: string;
  desc?: string;
  href?: string;
  cta?: string;
  api_url?: string;
  regex?: string;
};

export type Reward = {
  amount: string;
  token_symbol: string;
};

export type RewardsPerProtocol = {
  zklend: Reward[];
  nostra: Reward[];
  nimbora: Reward[];
  ekubo: Reward[];
};

export type Call = {
  contractaddress: string;
  calldata: string[];
  entrypoint: string;
};
