import { calculatePercentile } from "@utils/numberService";

describe("calculatePercentile function", () => {
  it("should return the correct percentile for valid input", () => {
    expect(calculatePercentile(3, 10)).toBe(70);
    expect(calculatePercentile(5, 20)).toBe(75);
  });

  it("should return 0 for rank equal to total", () => {
    expect(calculatePercentile(5, 5)).toBe(0);
    expect(calculatePercentile(0, 0)).toBe(0);
  });

  it("should return 100 for rank equal to 1", () => {
    expect(calculatePercentile(1, 10)).toBe(100);
    expect(calculatePercentile(1, 20)).toBe(100);
    expect(calculatePercentile(1, 5)).toBe(100);
  });

  it("should handle invalid input gracefully", () => {
    expect(calculatePercentile(0, 0)).toBe(0);
  });
});
