import { getBrowser, getTweetLink } from "@utils/browserService";

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
