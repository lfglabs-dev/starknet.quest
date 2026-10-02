import React from 'react';
import Image from 'next/image';

interface TokenIconProps {
  url?: string | null;
  size?: number;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ url, size = 24, className = "" }) => {
  // Se a URL não existir, não renderizamos nada para evitar o ícone de imagem quebrada
  if (!url) {
    return null;
  }

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <Image 
        src={url} 
        alt="Token Icon" 
        fill 
        className="object-contain"
        onError={(e) => {
          // Caso a URL exista mas o link esteja quebrado, removemos o elemento para evitar o ícone de erro
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
};
