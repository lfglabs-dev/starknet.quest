import { getCurrentNetwork, NetworkType } from "@utils/network";

describe("getCurrentNetwork function", () => {
  it("should return TESTNET if NEXT_PUBLIC_IS_TESTNET is true", () => {
    expect(getCurrentNetwork()).toBe(NetworkType.TESTNET);
  });
});
