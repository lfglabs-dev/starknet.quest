import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
} from "react";
import styles from "../../../styles/components/quests/quizzes.module.css";

type OrderingProps = {
  setSelected: Dispatch<SetStateAction<boolean>>;
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
  selectedOptions: string[];
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
                if (selectedOptions.includes(index.toString()))
                  setSelectedOptions(
                    selectedOptions.filter((item) => item !== index.toString())
                  );
                else setSelectedOptions([...selectedOptions, index.toString()]);
              }}
              className={styles.checkbox}
              checked={selectedOptions.includes(index.toString())}
            />
            <label className={styles.checkboxLabel} htmlFor={option}>
              {selectedOptions.indexOf(index.toString()) !== -1 && (
                <strong className={styles.labelNumberIcon}>
                  {
                    // Get the index of the option in the selectedOptions array
                    selectedOptions.indexOf(index.toString()) + 1
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
