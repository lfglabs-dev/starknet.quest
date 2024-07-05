import Typography from "@components/UI/typography/typography";
import { CDNImg } from "@components/cdn/image";
import { TEXT_TYPE } from "@constants/typography";
import React, { useCallback } from "react";

const ActionText = ({ type }: { type: string }) => {
  const getLogo = useCallback((actionType: string) => {
    switch (actionType) {
      case "Provide Liquidity":
        return "/icons/waterIcon.svg";
      case "Lend":
        return "/icons/lendIcon.svg";
      case "Strategies":
        return "/icons/strategyIcon.svg";
      case "Derivatives":
        return "/icons/strategyIcon.svg";
    }
  }, []);

  return (
    <div className="flex flex-row gap-2">
      <CDNImg loading="eager" width={20} src={getLogo(type)} alt={type} />
      <Typography type={TEXT_TYPE.BODY_SMALL} color="white">
        {type}
      </Typography>
    </div>
  );
};

export default ActionText;
