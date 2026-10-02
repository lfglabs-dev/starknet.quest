import React from 'react';
import { TokenIcon } from '../TokenIcon';

interface TokenRowProps {
  token: {
    symbol: string;
    name: string;
    icon: string | null;
    // ... outras propriedades
  };
}

export const TokenRow: React.FC<TokenRowProps> = ({ token }) => {
  return (
    <div className="flex items-center gap-2 p-2">
      {/* A renderização condicional agora é tratada dentro do TokenIcon, 
          mas garantimos que passamos a prop corretamente */}
      <TokenIcon url={token.icon} size={20} />
      <span className="font-medium">{token.symbol}</span>
      {/* Restante do componente */}
    </div>
  );
};
