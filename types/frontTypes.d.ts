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
  verifyEndpoint?: string;
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
};

type Identity = {
  id: string;
  addr: string;
  domain: string;
  is_owner_main: Boolean;
  error?: string;
};

type NftCard = {
  onClick: () => void;
  title: string;
  image: string;
};

type SocialMediaActions = {
  tokenId: string;
  isOwner: boolean;
  domain?: string;
};
