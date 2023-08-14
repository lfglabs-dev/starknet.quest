import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "../../../styles/components/quests/quizzQuestion.module.css";

type OrderingProps = {
  setSelected: Dispatch<SetStateAction<boolean>>;
  question: QuizQuestion;
};

const Ordering: FunctionComponent<OrderingProps> = ({
  setSelected,
  question,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

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
                if (selectedOptions.includes(option))
                  setSelectedOptions(
                    selectedOptions.filter((item) => item !== option)
                  );
                else setSelectedOptions([...selectedOptions, option]);
              }}
              className={styles.checkbox}
              checked={selectedOptions.includes(option)}
            />
            <label className={styles.checkboxLabel} htmlFor={option}>
              {selectedOptions.indexOf(option) !== -1 && (
                <strong className={styles.labelNumberIcon}>
                  {
                    // Get the index of the option in the selectedOptions array
                    selectedOptions.indexOf(option) + 1
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
