import React, { FunctionComponent, useEffect } from "react";
import styles from "@styles/components/quests/quiz.module.css";
import { CDNImg } from "@components/cdn/image";

type ImageChoiceProps = {
  setSelected: (s: boolean) => void;
  setSelectedOptions: (selectedOptions: number[]) => void;
  selectedOptions: number[];
  question: QuizQuestion;
};

const ImageChoice: FunctionComponent<ImageChoiceProps> = ({
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
    <div className={`${styles.questionContainer} ${styles.full}`}>
      <div className={styles.tableLayout}>
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`${styles.checkBoxContainer} ${styles.checkboxImageContainer} ${selectedOptions.includes(index) && styles.checkboxchecked}`}
          >
            
            <label className={styles.checkboxLabel} htmlFor={option}>
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
              <CDNImg src={option} className={styles.checkboxImage} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageChoice;
