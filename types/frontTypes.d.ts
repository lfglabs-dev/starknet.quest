type IconProps = { width: string; color?: string; secondColor?: string };

type Issuer = {
  name: string;
  logoFavicon: string;
};

type Nft = {
  imgSrc: string;
  level?: number;
};

type Task = {
  name: string;
  description: string;
  href: string;
  cta?: string;
  verifyEndpoint: string;
  verifyRedirect: string | null;
  verifyEndpointType: string;
  refreshRewards: () => void;
  setShowQuiz: (s: ReactNode) => void;
  wasVerified?: boolean;
  hasError?: boolean;
  verifyError?: string;
  quizName?: string;
  issuer?: Issuer;
  setShowDomainPopup: (show: boolean) => void;
  hasRootDomain: boolean;
  customError: string;
  checkUserRewards: () => void;
  expired: boolean;
};

type TaskProps = Task & { id: number };

type TaskError = {
  taskId: number;
  res: boolean;
  error?: string;
};

type Quiz = {
  name: string;
  description: string;
  questions: QuizQuestion[];
};

type QuizQuestion = {
  kind: "text_choice" | "image_choice" | "ordering";
  layout: "default" | "illustrated_left";
  question: string;
  options: string[];
  image_for_layout: string | null;
};

type Quest = {
  issuer: Issuer;
  name: string;
  description: string;
  tasks: Task[];
};

type Boost = {
  amount: number;
  token: string;
  expiry: number;
  quests: number[];
  claimed?: boolean;
  winner: string[] | null;
  img_url: string;
  id: number;
  name: string;
  hidden: boolean;
  num_of_winners: number;
  token_decimals: number;
};

type Reward = {
  onClick: () => void;
  reward: string;
  imgSrc: string;
  disabled: boolean;
};

type Identity = {
  addr: string;
  domain?: string;
  domain_expiry?: number | null;
  is_owner_main?: boolean;
  owner_addr?: string;
  old_discord?: string;
  old_twitter?: string;
  old_github?: string;
  discord?: string;
  twitter?: string;
  github?: string;
  starknet_id?: string;
  error?: string;
};

type NftCard = {
  title: string;
  image: string;
  url: string;
};

type StarkscanNftProps = {
  animation_url: string | null;
  attributes: Attribute[];
  contract_address: string;
  description: string | null;
  external_url: string;
  image_url: string | null;
  image_medium_url: string | null;
  image_small_url: string | null;
  minted_at_transaction_hash: string | null;
  minted_by_address: string | null;
  token_id: string;
  name: string | null;
  nft_id: string | null;
  token_uri: string | null;
  minted_at_timestamp: number;
};

type Attribute = {
  trait_type: string;
  value: string | number;
};

type EligibleReward = {
  task_id: number;
  nft_contract: string;
  token_id: string;
  sig: string[];
};

type BraavosScoreProps = {
  score: number;
  protocols: string[];
};

type StarkscanApiResult = {
  data: StarkscanNftProps[];
  next_url?: string;
  remainder?: StarkscanNftProps[];
};

type Step = {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  banner: string;
  overlay?: React.ReactNode;
};

type CornerStyle = "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
type SquareStyle = "bottomRight" | "bottomLeft" | "topRight" | "topLeft";

type ProfileCard = {
  title: string;
  identity: Identity;
  addressOrDomain: string | string[] | undefined;
  sinceDate: string | null;
  achievements: BuildingsInfo[];
  soloBuildings: StarkscanNftProps[];
};

type Signature = [string, string];

type UserAchievement = {
  name: string;
  shortDescription: string;
  title: string;
  description: string;
  completed: boolean;
  verifyType: string;
  id: number;
};

type UserAchievements = {
  name: string;
  description: string;
  img_url: string;
  achievements: Achievement[];
};

type BuildingsInfo = {
  id: number;
  name: string;
  description: string;
  entity: string;
  level: number;
  img_url: string;
  pos?: THREE.Vector2;
};

type QuestCategory = {
  name: string;
  img: string;
  questNumber: number;
  quests: QuestDocument[];
};

type LandTabs = "achievements" | "nfts";

// Here we can add more types of notifications
type NotificationData = TransactionData;

type SQNotification<T> = {
  address?: string; // decimal address
  timestamp: number;
  subtext: string;
  type: NotificationType;
  data: T;
};

type SQInfoData = {
  title: string;
  subtext: string;
  link?: string;
  linkText?: string;
};

type TransactionData = {
  type: TransactionType;
  hash: string;
  status: "pending" | "success" | "error";
  txStatus?:
    | "NOT_RECEIVED"
    | "RECEIVED"
    | "ACCEPTED_ON_L2"
    | "ACCEPTED_ON_L1"
    | "REJECTED"
    | "REVERTED";
};

type FormattedRankingProps = {
  address: string;
  xp: number;
  achievements: number;
  completedQuests?: number;
  displayName?: string;
}[];

type RankingProps = {
  data: {
    first_elt_position: number;
    ranking: { address: string; xp: number; achievements: number }[];
  };
  paginationLoading: boolean;
  setPaginationLoading: (_: boolean) => void;
  selectedAddress: string;
};

type ControlsDashboardProps = {
  ranking: RankingData;
  handlePagination: (_: string) => void;
  rowsPerPage: number;
  setRowsPerPage: (_: number) => void;
  leaderboardToppers: LeaderboardToppersData;
  duration: string;
  setCustomResult: (_: boolean) => void;
};

type RankingData = {
  first_elt_position: number;
  ranking: { address: string; xp: number; achievements: number }[];
};

type LeaderboardToppersData = {
  best_users: { address: string; xp: number; achievements: number }[];
  total_users: number;
  position?: number;
};

type PickRandomObjects = {
  questArray: QuestDocument[];
  count?: number;
};