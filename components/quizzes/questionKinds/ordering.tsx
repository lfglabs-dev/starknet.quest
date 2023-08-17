import React, { FunctionComponent, useEffect } from "react";
import styles from "../../../styles/components/quests/quizzes.module.css";

type OrderingProps = {
  setSelected: (s: boolean) => void;
  setSelectedOptions: (selectedOptions: number[]) => void;
  selectedOptions: number[];
  question: QuizQuestion;
};

const Ordering: FunctionComponent<OrderingProps> = ({
  setSelected,
  setSelectedOptions,
  selectedOptions,
  question,
}) => {
  useEffect(() => {
    if (selectedOptions.length === question.options.length) setSelected(true);
    else setSelected(false);
  }, [selectedOptions]);
  return (
    <div className={`${styles.questionContainer} ${styles.full}`}>
      <div className={styles.listLayout}>
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
              {selectedOptions.indexOf(index) !== -1 && (
                <strong className={styles.labelNumberIcon}>
                  {
                    // Get the index of the option in the selectedOptions array
                    selectedOptions.indexOf(index) + 1
                  }
                </strong>
              )}
              <strong>{option}</strong>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ordering;
