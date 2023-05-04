type QueryError = { error: string };

type QuestDocument = {
  id: number;
  name: string;
  desc: string;
  issuer: string;
  category: string;
  logo: string;
  rewards_img: string;
  rewards_title: string;
  rewards_nfts: NFTItem[];
};

type NFTItem = {
  img: string;
  level: number;
};

type TaskDocument = {
  id: number;
  quest_id: number;
  name: string;
  desc: string;
  href: string;
  cta?: string;
  verify_endpoint?: string;
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
