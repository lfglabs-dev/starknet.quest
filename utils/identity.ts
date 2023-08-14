export const getIdentityData = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/id_to_data?id=${id}`
  );
  return response.json();
};
