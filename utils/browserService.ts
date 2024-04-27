export function getBrowser(userAgent: string): string | undefined {
  if (userAgent.includes("Chrome")) {
    return "chrome";
  } else if (userAgent.includes("Firefox")) {
    return "firefox";
  } else {
    return undefined;
  }
}

export const getTweetLink = (tweet: string): string => {
  const encodedTweet = encodeURIComponent(tweet);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;
  return tweetUrl;
};
