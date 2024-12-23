import {
  calculatePercentile,
  numberWithCommas,
  formatNumberThousandEqualsK,
  formatNumberWithCommas,
  formatNumber,
} from "@utils/numberService";

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

describe("formatNumberThousandEqualsK function", () => {
  it("should return a formatted string for numbers >= 1000", () => {
    expect(formatNumberThousandEqualsK(1000)).toBe("+1k");
    expect(formatNumberThousandEqualsK(1500)).toBe("+2k");
  });

  it("should return the input number as string for numbers < 1000", () => {
    expect(formatNumberThousandEqualsK(999)).toBe("999");
    expect(formatNumberThousandEqualsK(500)).toBe("500");
  });
});

describe("formatNumberWithCommas function", () => {
  it("should return a string representation of the number with commas", () => {
    expect(formatNumberWithCommas(1000)).toBe("1,000");
    expect(formatNumberWithCommas(1000000)).toBe("1,000,000");
    expect(formatNumberWithCommas(123456789)).toBe("123,456,789");
  });

  it("should handle negative numbers", () => {
    expect(formatNumberWithCommas(-1000)).toBe("-1,000");
    expect(formatNumberWithCommas(-1000000)).toBe("-1,000,000");
    expect(formatNumberWithCommas(-123456789)).toBe("-123,456,789");
  });

  it("should handle floating point numbers", () => {
    expect(formatNumberWithCommas(1234.56)).toBe("1,234.56");
    expect(formatNumberWithCommas(-1234.56)).toBe("-1,234.56");
  });

  it("should return '0' for input 0", () => {
    expect(formatNumberWithCommas(0)).toBe("0");
  });
});

describe("formatNumber function", () => {
  it("should return a percentage representation of the number to two decimal place", () => {
    expect(
      formatNumber(123.242434, { style: "percent", maximumFractionDigits: 2 })
    ).toBe("123.24%");
    expect(
      formatNumber(90.011113332, { style: "percent", maximumFractionDigits: 2 })
    ).toBe("90.01%");
    expect(
      formatNumber(1.2394, { style: "percent", maximumFractionDigits: 2 })
    ).toBe("1.24%");
  });
  it("should return a compact amount representation of the number", () => {
    expect(
      formatNumber(1500, {
        style: "currency",
        currency: "USD",
        notation: "compact",
      })
    ).toBe("$1.5K");
    expect(
      formatNumber(9800000, {
        style: "currency",
        currency: "USD",
        notation: "compact",
      })
    ).toBe("$9.8M");
    expect(
      formatNumber(1000000000, {
        style: "currency",
        currency: "USD",
        notation: "compact",
      })
    ).toBe("$1B");
  });
  it("should return a standard amount representation of the number", () => {
    expect(
      formatNumber(1000, {
        style: "currency",
        currency: "USD",
      })
    ).toBe("$1,000.00");
    expect(
      formatNumber(91232.354, {
        style: "currency",
        currency: "USD",
      })
    ).toBe("$91,232.35");
    expect(
      formatNumber(1000000000, {
        style: "currency",
        currency: "USD",
      })
    ).toBe("$1,000,000,000.00");
  });
});
