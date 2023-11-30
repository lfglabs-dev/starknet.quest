import Image, { ImageProps, StaticImageData } from "next/image";
import React, { ImgHTMLAttributes } from "react";

export const CDNImg: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  ...props
}) => {
  const fullPath =
    process.env.NODE_ENV === "production" && src && src.startsWith("/")
      ? `${process.env.NEXT_PUBLIC_CDN_URL}${src}`
      : src;

  return <img src={fullPath} {...props} />;
};

type ImageSrc = string | StaticImageData;

interface CDNImageProps extends Omit<ImageProps, "src"> {
  src: ImageSrc;
}

export const CDNImage: React.FC<CDNImageProps> = ({ src, ...props }) => {
  let imagePath: string;

  if (typeof src === "string") {
    imagePath =
      process.env.NODE_ENV === "production" && src.startsWith("/")
        ? `${process.env.NEXT_PUBLIC_CDN_URL}${src}`
        : src;
  } else {
    // if src is not an URL, we can't use the CDN
    imagePath = src.src;
  }

  return <Image src={imagePath} {...props} />;
};
