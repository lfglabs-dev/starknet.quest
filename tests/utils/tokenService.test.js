import { getTokenName } from "@utils/tokenService";
import { TOKEN_ADDRESS_MAP } from "@utils/constants";

describe("getTokenName function", () => {
  it("should return 'USDC' for USDC token address on the current network", () => {
    // Assuming TOKEN_ADDRESS_MAP is defined and has the necessary structure
    const tokenName = getTokenName(TOKEN_ADDRESS_MAP["TESTNET"].USDC);
    expect(tokenName).toBe("USDC");
  });

  it("should return 'ETH' for ETH token address on the current network", () => {
    // Assuming TOKEN_ADDRESS_MAP is defined and has the necessary structure
    const tokenName = getTokenName(TOKEN_ADDRESS_MAP["TESTNET"].ETH);
    expect(tokenName).toBe("ETH");
  });

  it("should return 'USDC' for unknown token addresses on the current network", () => {
    // Assuming TOKEN_ADDRESS_MAP is defined and has the necessary structure
    const tokenName = getTokenName("unknownTokenAddress");
    expect(tokenName).toBe("USDC");
  });
});
