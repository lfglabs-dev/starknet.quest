const API_URL = process.env.NEXT_PUBLIC_API_LINK;

export const getDomainFromAddress = async (
  address: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/addr_to_domain?addr=${address}`);
    const data = await response.json();
    return data.domain;
  } catch (err) {
    return "";
  }
};
