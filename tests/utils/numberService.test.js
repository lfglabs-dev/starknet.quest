import { calculatePercentile, numberWithCommas } from "@utils/numberService";

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

describe("numberWithCommas function", () => {
  it("should return a string representation of the number with commas", () => {
    expect(numberWithCommas(1000)).toBe("1,000");
    expect(numberWithCommas(1000000)).toBe("1,000,000");
    expect(numberWithCommas(123456789)).toBe("123,456,789");
  });

  it("should handle negative numbers", () => {
    expect(numberWithCommas(-1000)).toBe("-1,000");
    expect(numberWithCommas(-1000000)).toBe("-1,000,000");
    expect(numberWithCommas(-123456789)).toBe("-123,456,789");
  });

  it("should handle floating point numbers", () => {
    expect(numberWithCommas(1234.56)).toBe("1,234.56");
    expect(numberWithCommas(-1234.56)).toBe("-1,234.56");
  });

  it("should return '0' for input 0", () => {
    expect(numberWithCommas(0)).toBe("0");
  });

  it("should return an empty string for undefined input", () => {
    expect(numberWithCommas(undefined)).toBe("");
  });
});
