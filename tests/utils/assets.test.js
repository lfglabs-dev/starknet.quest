import { retrieveAssets, getNfts } from "../../utils/assets";

global.fetch = jest.fn();

describe("retrieveAssets", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("successfully retrieves assets without pagination", async () => {
    const mockAssets = {
      data: [
        { id: "1", name: "Asset 1" },
        { id: "2", name: "Asset 2" },
      ],
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockAssets),
    });

    const url = "https://api.example.com/assets";
    const result = await retrieveAssets(url);

    expect(result.data).toEqual(mockAssets.data);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": expect.any(String),
      },
    });
  });

  it("handles pagination correctly", async () => {
    const firstPageAssets = {
      data: [
        { id: "1", name: "Asset 1" },
        { id: "2", name: "Asset 2" },
      ],
      next_url: "https://api.example.com/assets?page=2",
    };
    const secondPageAssets = {
      data: [
        { id: "3", name: "Asset 3" },
        { id: "4", name: "Asset 4" },
      ],
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(firstPageAssets),
    });
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(secondPageAssets),
    });
    const url = "https://api.example.com/assets";
    const result = await retrieveAssets(url);

    expect(result.data).toEqual([
      ...firstPageAssets.data,
      ...secondPageAssets.data,
    ]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe("getNfts", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("retrieves NFTs for a given address on the mainnet", async () => {
    const mockNfts = {
      data: [
        { id: "1", name: "NFT 1" },
        { id: "2", name: "NFT 2" },
      ],
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockNfts),
    });

    const address = "0x123";
    const network = "MAINNET";
    const nfts = await getNfts(address, network);

    expect(nfts).toEqual(mockNfts.data);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.starkscan.co"),
      expect.any(Object)
    );
  });

  it("retrieves NFTs for a given address on the testnet", async () => {
    const mockNfts = {
      data: [
        { id: "1", name: "NFT 1" },
        { id: "2", name: "NFT 2" },
      ],
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockNfts),
    });

    const address = "0x456";
    const network = "TESTNET";
    const nfts = await getNfts(address, network);

    expect(nfts).toEqual(mockNfts.data);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("api-testnet.starkscan.co"),
      expect.any(Object)
    );
  });
});
