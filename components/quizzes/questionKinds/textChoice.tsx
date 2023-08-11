import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "../../../styles/components/quests/quizzQuestion.module.css";

type TextChoiceProps = {
  setSelected: Dispatch<SetStateAction<boolean>>;
  question: QuizQuestion;
};

const TextChoice: FunctionComponent<TextChoiceProps> = ({
  setSelected,
  question,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

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
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextChoice;
