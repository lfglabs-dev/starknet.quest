/**
 * @jest-environment jsdom
 */

import {
  getBrowser,
  getTweetLink,
  writeToClipboard,
} from "@utils/browserService";

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

describe("Should test getBrowser function", () => {
  it("Should return Chrome", () => {
    expect(
      getBrowser(
        "userAgent Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
      )
    ).toEqual("chrome");
  });

  it("Should return firefox", () => {
    expect(
      getBrowser(
        "userAgent Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/116.0"
      )
    ).toEqual("firefox");
  });

  it("Should return an undefined if it's another browser or an empty string", () => {
    expect(
      getBrowser(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15"
      )
    ).toEqual(undefined);
    expect(getBrowser("")).toEqual(undefined);
  });
});

describe("getTweetLink function", () => {
  it("should return a valid tweet link", () => {
    const tweet = "This is a test tweet.";
    const expectedTweetLink =
      "https://twitter.com/intent/tweet?text=This%20is%20a%20test%20tweet.";
    expect(getTweetLink(tweet)).toBe(expectedTweetLink);
  });

  it("should encode special characters correctly", () => {
    const tweet = "Special characters: & % $ # @";
    const expectedTweetLink =
      "https://twitter.com/intent/tweet?text=Special%20characters%3A%20%26%20%25%20%24%20%23%20%40";
    expect(getTweetLink(tweet)).toBe(expectedTweetLink);
  });

  it("should handle empty input", () => {
    expect(getTweetLink("")).toBe("https://twitter.com/intent/tweet?text=");
  });

  it("should handle undefined input", () => {
    expect(getTweetLink(undefined)).toBe(
      "https://twitter.com/intent/tweet?text=undefined"
    );
  });
});

describe("writeToClipboard function", () => {
  const testData = "Test data to be copied to clipboard";

  beforeAll(() => {
    navigator.clipboard.writeText.mockResolvedValue(undefined);
    writeToClipboard(testData);
  });

  it("should call navigator.clipboard.writeText with the provided data", () => {
    // Mocking navigator.clipboard.writeText
    const originalWriteText = navigator.clipboard.writeText;
    navigator.clipboard.writeText = jest.fn();

    writeToClipboard(testData);

    // Expecting navigator.clipboard.writeText to be called with the provided data
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testData);

    // Restore the original function after the test
    navigator.clipboard.writeText = originalWriteText;
  });
});
