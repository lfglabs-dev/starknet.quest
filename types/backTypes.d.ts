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
  mandatory_domain: string | null;
  expired: boolean;
  rewards_description: string | null;
  additional_desc: string | null;
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
  verify_endpoint: string;
  verify_endpoint_type: string;
  verify_redirect: string | null;
  completed: boolean;
  quiz_name: string | null;
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
