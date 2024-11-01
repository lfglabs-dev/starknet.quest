import React, { useState } from 'react';
import EyeIcon from "@components/UI/iconsComponents/icons/eyeIcon";
import EyeOffIcon from './iconsComponents/icons/eyeOffIcon';

type  ToggleVisibilityProps = {
  address: string;
  className?: string;
  iconSize?: string;
  wallet:boolean;
  hideBalance: boolean;
  setHideBalance: React.Dispatch<React.SetStateAction<boolean>>;
}

const  ToggleVisibility: React.FC< ToggleVisibilityProps> = ({ address, className, iconSize = "24",wallet=false, hideBalance, setHideBalance }) => {
    const toggleBalance = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setHideBalance(!hideBalance);
    };

  return (
    <button className={className} onClick={toggleBalance}>
      {!hideBalance ? (
        <EyeIcon width={iconSize} color={wallet ? undefined : "#F4FAFF"} />
      ) : (
        <EyeOffIcon width={iconSize} color={wallet ? undefined : "#F4FAFF"}/>
      )}
    </button>
  );
};

export default ToggleVisibility;