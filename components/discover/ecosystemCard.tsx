import Image from 'next/image'
import { ExternalLink } from '@components/base/externalLink'
import { LuExternalLink } from 'react-icons/lu'
import endurfiImage from './images/endurfi.svg'

interface EcosystemCardProps {
  url?: string
  image?: string
  title?: string
}

export function EcosystemCard({
  url = 'https://app.endur.fi/',
  image = endurfiImage,
  title = 'Endurfi',
}: EcosystemCardProps) {
  return (
    <ExternalLink
      href={url}
      className="animate-card flex flex-col justify-between items-center h-[10rem] max-w-[11rem] bg-gray-300 w-full relative rounded-lg p-8"
    >
      <div className="absolute top-3 right-3">
        <LuExternalLink />
      </div>

      <div className="relative overflow-hidden rounded-full aspect-square w-12 h-12">
        <Image
          src={image}
          alt={`${title} - Starknet DeFi Ecosystem`}
          className="object-cover"
        />
      </div>

      <p className="font-bold text-secondary text-xl">{title}</p>
    </ExternalLink>
  )
}
