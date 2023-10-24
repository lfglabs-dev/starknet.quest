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

export type RequestProps = {
  address: string;
};
export interface TwitterRequestProps {
  query: {
    id: string;
  };
}

export type CustomTwitterNextApiRequest = NextApiRequest & TwitterRequestProps;

type AchievementsDocument = {
  category_name: string;
  category_desc: string;
  category_img_url: string;
  category_type: string;
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
  achieved: boolean;
};
