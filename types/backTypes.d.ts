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
