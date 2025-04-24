import Image from "next/image";
import Link from "next/link";

interface IDefiCategoryCardProps {
  url: string;
  icon: string;
  title: string;
}

export const DefiCategoryCard = ({
  url,
  icon,
  title,
}: IDefiCategoryCardProps) => {
  return (
    <Link
      href={url}
      target="_blank"
      title={title}
      className="h-[160px] relative justify-center items-center bg-[#1F1F25] w-full max-w-[176px] rounded-lg p-4 text-white hover:bg-opacity-80 hover:bg-[#4a4c53] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#ffffff0d] transition-all duration-300 flex flex-col gap-6"
    >
      <div className="absolute pointer-events-none top-3 right-3 size-4">
        <Image src="/icons/externalLink.svg" width={16} height={16} alt="" />
      </div>
      <div className="relative overflow-hidden bg-white rounded-full aspect-square size-12 bg-opacity-5">
        <Image
          src={icon}
          width={100}
          height={100}
          alt={`${title} logo`}
          className="text-xs italic"
        />
      </div>
      <p className="text-center">{title}</p>
    </Link>
  );
};
