import React, { useState } from 'react';
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import VerifiedIcon from "@components/UI/iconsComponents/icons/verifiedIcon";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

interface CopyAddressProps {
  address: string;
  className?: string;
  iconSize?: string;
  wallet:boolean;
}

const CopyAddress: React.FC<CopyAddressProps> = ({ address, className, iconSize = "24",wallet=false }) => {
  const [copied, setCopied] = useState(false);


    const copyAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCopied(true);
    navigator.clipboard.writeText(address ?? "");
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <button className={className} onClick={copyAddress}>
      {!copied ? (
        <CopyIcon width={iconSize} color={wallet ? undefined : "#F4FAFF"} />
      ) : (
        <VerifiedIcon width={iconSize} />
      )}
      {wallet && (
        <Typography
          color="secondary500"
          type={TEXT_TYPE.BUTTON_SMALL}
          style={{ textTransform: 'none', }}
        >
          Copy Address
        </Typography>
      )}
    </button>
  );
};

export default CopyAddress;
