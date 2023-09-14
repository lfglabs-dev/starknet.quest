type IconProps = { width: string; color?: string };

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
  isUppercase?: boolean;
  content: React.ReactNode;
};

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
  pos?: THREE.Vector2;
};
