import { timeElapsed } from "../../utils/timeService";

describe("timeElapsed function", () => {
    const seconds = 1000;
    const minutes = 60 * seconds;
    const hours = 60 * minutes;
    const days = 24 * hours;
    const weeks = 7 * days;
    const months = 4.35 * weeks; // Average weeks in a month
    const years = 12 * months;
  
    it("should return time in seconds format", () => {
      const now = Date.now();
      expect(timeElapsed(now - 10 * seconds)).toBe("10 s ago");
    });
  
    it("should return time in minutes format", () => {
      const now = Date.now();
      expect(timeElapsed(now - 10 * minutes)).toBe("10 min. ago");
    });
  
    it("should return time in hours format", () => {
      const now = Date.now();
      expect(timeElapsed(now - 3 * hours)).toBe("3 hr. ago");
    });
  
    it("should return 'yesterday' or days format", () => {
      const now = Date.now();
      expect(timeElapsed(now - 1 * days)).toBe("yesterday");
      expect(timeElapsed(now - 3 * days)).toBe("3 days ago");
    });
  
    it("should return 'last week' or weeks format", () => {
      const now = Date.now();
      expect(timeElapsed(now - 1 * weeks)).toBe("last week");
      expect(timeElapsed(now - 3 * weeks)).toBe("3 weeks ago");
    });
  
    it("should return 'last month' or months format", () => {
      const now = Date.now();
      expect(timeElapsed(now - 1 * months)).toBe("last month");
      expect(timeElapsed(now - 3 * months)).toBe("3 months ago");
    });
  
    it("should return 'last year' or years format", () => {
      const now = Date.now();
      expect(timeElapsed(now - 1 * years)).toBe("last year");
      expect(timeElapsed(now - 3 * years)).toBe("3 years ago");
    });
  });