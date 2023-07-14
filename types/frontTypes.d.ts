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

type AspectNftProps = {
  contract_address: string;
  token_id: string;
  name: string | null;
  description: string | null;
  token_uri: string | null;
  image_uri: string | null;
  image_blur_hash: string | null;
  image_url_copy: string | null;
  image_small_url_copy: string | null;
  image_medium_url_copy: string | null;
  animation_uri: string | null;
  external_uri: string;
  null;
  attributes: Attribute[];
  contract: any;
  owner: {
    account_address: string;
    quantity: string;
  };
  aspect_link: string;
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

type AspectApiResult = {
  assets: AspectNftProps[];
  next_url: string;
  remainder?: AspectNftProps[];
};

type Step = {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  banner: string;
  overlay?: React.ReactNode;
};
