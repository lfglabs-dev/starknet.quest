// hard to test because of ENV variables
export default function cdnize(src: string): string {
  console.log({
    test: process.env.VERCEL_ENV === "production" && src.startsWith("/"),
    test2: process.env.NEXT_PUBLIC_CDN_URL,
    test3: src,
    test4: src.startsWith("/"),
  });
  return process.env.VERCEL_ENV === "production" && src.startsWith("/")
    ? `${process.env.NEXT_PUBLIC_CDN_URL}${src}`
    : src;
}
