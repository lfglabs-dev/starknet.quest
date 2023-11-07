import { getDomainFromAddress } from '../../utils/domainService';

const API_URL = "https://api.starknet.id";

describe("getDomainFromAddress function", () => {
it("should return a valid domain for a valid address", async () => {
    const validAddress = "0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3";
    const expectedDomain = "fricoben.stark";

    // Mocking the fetch function to return a predefined response
    const mockResponse = { domain: expectedDomain };
    const fetchMock = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
    });
    (fetch as jest.Mock) = fetchMock;

    const domain = await getDomainFromAddress(validAddress);

    expect(domain).toBe(expectedDomain);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/addr_to_domain?addr=${validAddress}`);
  });

  it("should return an empty string for an invalid address", async () => {
    const invalidAddress = "0x123123123";
    const expectedDomain = "";

    // Mocking the fetch function to simulate an error
    const mockResponse = { domain: expectedDomain };
    const fetchMock = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });
    (fetch as jest.Mock) = fetchMock;

    const domain = await getDomainFromAddress(invalidAddress);

    expect(domain).toBe("");
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/addr_to_domain?addr=${invalidAddress}`);
  });
});