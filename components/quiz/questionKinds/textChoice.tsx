import React, { FunctionComponent, useEffect } from "react";
import styles from "@styles/components/quests/quiz.module.css";

type TextChoiceProps = {
  setSelected: (s: boolean) => void;
  setSelectedOptions: (selectedOptions: number[]) => void;
  selectedOptions: number[];
  question: QuizQuestion;
};

const TextChoice: FunctionComponent<TextChoiceProps> = ({
  setSelected,
  setSelectedOptions,
  selectedOptions,
  question,
}) => {
  useEffect(() => {
    if (selectedOptions.length > 0) setSelected(true);
    else setSelected(false);
  }, [selectedOptions]);

  return (
    <div className={styles.questionContainer}>
      <div className={styles.tableLayout}>
        {question.options.map((option, index) => (
          <div key={index} className={styles.checkBoxContainer}>
            <input
              type="checkbox"
              name="option"
              id={option}
              onChange={() => {
                if (selectedOptions.includes(index))
                  setSelectedOptions(
                    selectedOptions.filter((item) => item !== index)
                  );
                else setSelectedOptions([...selectedOptions, index]);
              }}
              className={styles.checkbox}
              checked={selectedOptions.includes(index)}
            />
            <label className={styles.checkboxLabel} htmlFor={option}>
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextChoice;
