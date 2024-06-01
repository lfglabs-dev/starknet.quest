import React, { FunctionComponent } from "react";
import Button from "../button";
import Typography from "../typography/typography";
import type { TEXT_TYPE } from "@constants/typography";

type ErrorScreenProps = {
  buttonText?: string;
  onClick?: () => void;
  errorMessage?: string;
};

const ErrorScreen: FunctionComponent<ErrorScreenProps> = ({
  buttonText,
  onClick,
  errorMessage,
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img
        src="/visuals/animals/tiger.webp"
        height={300}
        width={300}
        alt="error image"
      />
      <Typography type={TEXT_TYPE.H1} className="sm:text-4xl text-3xl mt-5">
        {errorMessage ? errorMessage : "Shit ... an error occurred !"}
      </Typography>
      {buttonText && onClick && (
        <div className="mt-8 flex justify-center">
          <Button onClick={onClick}>{buttonText}</Button>
        </div>
      )}
    </div>
  );
};

export default ErrorScreen;
