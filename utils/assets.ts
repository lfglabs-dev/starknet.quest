export const retrieveAssets = async (
  url: string,
  accumulatedAssets: StarkscanNftProps[] = []
): Promise<StarkscanApiResult> => {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `${process.env.NEXT_PUBLIC_STARKSCAN}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const assets = [...accumulatedAssets, ...data.data];
      if (data.next_url) {
        return retrieveAssets(data.next_url, assets);
      } else {
        return {
          data: assets,
        };
      }
    });
};

export const getNfts = async (
  address: string,
  network: string
): Promise<StarkscanNftProps[]> => {
  const url = `https://${
    network === "TESTNET" ? "api-testnet" : "api"
  }.starkscan.co/api/v0/nfts?owner_address=${address}`;
  const assets = await retrieveAssets(url);
  return assets.data;
};
