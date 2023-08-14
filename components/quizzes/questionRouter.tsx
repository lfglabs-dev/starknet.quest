import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import TextChoice from "./questionKinds/textChoice";
import ImageChoice from "./questionKinds/imageChoice";
import Ordering from "./questionKinds/ordering";

type QuestionRouterProps = {
  setSelected: Dispatch<SetStateAction<boolean>>;
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
  selectedOptions: string[];
  question: QuizQuestion;
};

const QuestionRouter: FunctionComponent<QuestionRouterProps> = ({
  setSelected,
  setSelectedOptions,
  selectedOptions,
  question,
}) => {
  const kind = question.kind;
  return kind === "text_choice" ? (
    <TextChoice
      question={question}
      setSelected={setSelected}
      setSelectedOptions={setSelectedOptions}
      selectedOptions={selectedOptions}
    />
  ) : kind === "image_choice" ? (
    <ImageChoice
      question={question}
      setSelected={setSelected}
      setSelectedOptions={setSelectedOptions}
      selectedOptions={selectedOptions}
    />
  ) : kind === "ordering" ? (
    <Ordering
      question={question}
      setSelected={setSelected}
      setSelectedOptions={setSelectedOptions}
      selectedOptions={selectedOptions}
    />
  ) : null;
};

export default QuestionRouter;
