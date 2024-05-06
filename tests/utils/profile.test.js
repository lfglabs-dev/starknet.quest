import { memberSince, hasVerifiedSocials } from "@utils/profile";

describe("memberSince function tests", () => {
  jest.useFakeTimers().setSystemTime(new Date("2023-09-05"));

  it("should return the membership duration in years", () => {
    const currentDate = new Date();
    const timestamp =
      Math.floor(currentDate.getTime() / 1000) - 3 * 365 * 24 * 3600; // 3 years ago
    expect(memberSince(timestamp)).toBe("Member since 3 years");
  });

  it("should return the membership duration in months", () => {
    const currentDate = new Date();
    const timestamp =
      Math.floor(currentDate.getTime() / 1000) - 4 * 30 * 24 * 3600; // 4 months ago
    expect(memberSince(timestamp)).toBe("Member since 4 months");
  });

  it("should return the membership duration in days", () => {
    const currentDate = new Date();
    const timestamp = Math.floor(currentDate.getTime() / 1000) - 13 * 24 * 3600; // 13 days ago
    expect(memberSince(timestamp)).toBe("Member since 13 days");
  });

  it("should return null if the membership duration is less than a day", () => {
    const currentDate = new Date();
    const timestamp = Math.floor(currentDate.getTime() / 1000) - 23 * 3600; // 23 hours ago
    expect(memberSince(timestamp)).toBeNull();
  });
});
