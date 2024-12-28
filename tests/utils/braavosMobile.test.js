import { mainnet, sepolia } from "@starknet-react/chains";
import {
  ConnectorNotConnectedError,
  UserNotConnectedError,
} from "@starknet-react/core";
import { BraavosMobileConnector, getBraavosMobile } from "@utils/braavosMobile";

describe("BraavosMobileConnector class", () => {
  let connector;

  beforeEach(() => {
    connector = new BraavosMobileConnector();
  });

  describe("id getter", () => {
    it("should return 'braavosMobile'", () => {
      expect(connector.id).toBe("braavosMobile");
    });
  });

  describe("icon getter", () => {
    it("should return the same icon for light and dark modes", () => {
      expect(connector.icon.light).toBeDefined();
      expect(connector.icon.dark).toBeDefined();
      expect(connector.icon.light).toBe(connector.icon.dark);
    });
  });

  describe("name getter", () => {
    it("should return 'Braavos (mobile)'", () => {
      expect(connector.name).toBe("Braavos (mobile)");
    });
  });

  describe("available method", () => {
    it("should return true", () => {
      expect(connector.available()).toBe(true);
    });
  });

  describe("wallet getter", () => {
    it("should throw a ConnectorNotConnectedError", () => {
      expect(() => connector.wallet).toThrow(ConnectorNotConnectedError);
    });
  });

  describe("disconnect method", () => {
    it("should throw a UserNotConnectedError", () => {
      expect(() => connector.disconnect()).toThrow(UserNotConnectedError);
    });
  });

  describe("account method", () => {
    it("should throw a ConnectorNotConnectedError", () => {
      expect(() => connector.account()).toThrow(ConnectorNotConnectedError);
    });
  });

  describe("chainId method", () => {
    it("should return sepolia.id when NEXT_PUBLIC_IS_TESTNET is 'true'", async () => {
      process.env.NEXT_PUBLIC_IS_TESTNET = "true";
      const result = await connector.chainId();
      expect(result).toBe(sepolia.id);
    });

    it("should return mainnet.id when NEXT_PUBLIC_IS_TESTNET is not 'true'", async () => {
      process.env.NEXT_PUBLIC_IS_TESTNET = "false";
      const result = await connector.chainId();
      expect(result).toBe(mainnet.id);
    });
  });

  describe("ready method", () => {
    it("should return true as a Promise", async () => {
      const result = await connector.ready();
      expect(result).toBe(true);
    });
  });
});

describe("getBraavosMobile function", () => {
  it("should return an instance of BraavosMobileConnector", () => {
    const instance = getBraavosMobile();
    expect(instance).toBeInstanceOf(BraavosMobileConnector);
  });
});
