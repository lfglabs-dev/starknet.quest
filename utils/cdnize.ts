// hard to test because of ENV variables
export default function cdnize(src: string): string {
  console.log({
    test: process.env.VERCEL_ENV === "production" && src.startsWith("/"),
    test2: process.env.NEXT_PUBLIC_CDN_URL,
    test3: src,
    test4: src.startsWith("/"),
    test5: `${process.env.NEXT_PUBLIC_CDN_URL}${src}`,
    test6: process.env.VERCEL_ENV,
    test7: process.env.NODE_ENV,
  });
  return process.env.VERCEL_ENV === "production" && src.startsWith("/")
    ? `${process.env.NEXT_PUBLIC_CDN_URL}${src}`
    : src;
}
