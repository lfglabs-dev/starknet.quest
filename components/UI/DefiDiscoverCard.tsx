import Image from 'next/image';
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from '@constants/typography';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface DefiDiscoverCardProps {
  title: string;
  image: string;
  link: string;
}

export default function DefiDiscoverCard({ title, image, link }: DefiDiscoverCardProps) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="no-underline">
    <div className="relative bg-gray-300 w-[176px] h-[160px] p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:bg-[var(--hover-background-color)] hover:shadow-lg hover:shadow-[#ffffff0d] cursor-pointer">
      <FaExternalLinkAlt className='absolute top-3 right-3 text-[#E1DCEA] m-1 text-xs'/>
      <div className="mb-5 rounded-full overflow-hidden">
        <Image src={image} alt={title} width={48} height={48} loading="eager" />
      </div>
      <Typography 
          type={TEXT_TYPE.H3} 
          className="text-white font-semibold text-lg"
        >
          {title}
        </Typography>
    </div>
    </a>
  );
}
