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
  wasVerified?: boolean;
  hasError?: boolean;
  verifyError?: string;
  quizName?: string;
};

type TaskProps = Task & { id: number };

type TaskError = {
  taskId: number;
  res: boolean;
  error?: string;
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
  id: string;
  addr: string;
  domain: string;
  is_owner_main: boolean;
  error?: string;
};

type NftCard = {
  title: string;
  image: string;
  url: string;
};

type SocialMediaActions = {
  tokenId: string;
  isOwner: boolean;
  domain?: string;
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
