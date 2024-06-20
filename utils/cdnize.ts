// hard to test because of ENV variables
export default function cdnize(src: string): string {
  const env = process.env.NEXT_PUBLIC_IS_TESTNET
    ? process.env.VERCEL_ENV
    : process.env.NODE_ENV;

  return env === "production" && src?.startsWith("/")
    ? `${process.env.NEXT_PUBLIC_CDN_URL}${src}`
    : src;
}
