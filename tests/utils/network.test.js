import { getCurrentNetwork, NetworkType } from "@utils/network";

describe("getCurrentNetwork function", () => {
  it("should return MAINNET if NEXT_PUBLIC_IS_TESTNET is false", () => {
    expect(getCurrentNetwork()).toBe(NetworkType.MAINNET);
  });
});
