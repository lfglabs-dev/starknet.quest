import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import TextChoice from "./questionKinds/textChoice";

type QuestionRouterProps = {
  setSelected: Dispatch<SetStateAction<boolean>>;
  question: QuizQuestion;
};

const QuestionRouter: FunctionComponent<QuestionRouterProps> = ({
  setSelected,
  question,
}) => {
  const kind = question.kind;
  return (
    <>
      {kind === "text_choice" ? (
        <TextChoice question={question} setSelected={setSelected} />
      ) : null}
    </>
  );
};

export default QuestionRouter;
