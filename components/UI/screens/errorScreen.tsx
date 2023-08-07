import React, { FunctionComponent } from "react";
import Button from "../button";

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
      <h1 className="sm:text-4xl text-3xl mt-5">
        {errorMessage ? errorMessage : "Shit ... an error occurred !"}
      </h1>
      {buttonText && onClick && (
        <div className="mt-8 flex justify-center">
          <Button onClick={onClick}>{buttonText}</Button>
        </div>
      )}
    </div>
  );
};

export default ErrorScreen;
