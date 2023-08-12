import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import TextChoice from "./questionKinds/textChoice";
import ImageChoice from "./questionKinds/imageChoice";

type QuestionRouterProps = {
  setSelected: Dispatch<SetStateAction<boolean>>;
  question: QuizQuestion;
};

const QuestionRouter: FunctionComponent<QuestionRouterProps> = ({
  setSelected,
  question,
}) => {
  const kind = question.kind;
  return kind === "text_choice" ? (
    <TextChoice question={question} setSelected={setSelected} />
  ) : kind === "image_choice" ? (
    <ImageChoice question={question} setSelected={setSelected} />
  ) : (
    <p>Not implemented yet</p>
  );
};

export default QuestionRouter;
