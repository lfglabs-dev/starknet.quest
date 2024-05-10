const baseurl = process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK;

export const getDataFromId = async (id: string): Promise<Identity> => {
  const response = await fetch(`${baseurl}/id_to_data?id=${id}`);
  return response.json();
};

export const getDataFromDomain = async (domain: string): Promise<Identity> => {
  const response = await fetch(`${baseurl}/domain_to_data?domain=${domain}`);
  return response.json();
};
