import React, { FunctionComponent } from "react";
import Menu from "./menu";
import styles from "../../../styles/components/quests/quizzes.module.css";
import Button from "../../UI/button";

type EndScreenProps = {
  quit: () => void;
};

const EndScreen: FunctionComponent<EndScreenProps> = ({ quit }) => {
  return (
    <>
      <div className={styles.content}>
        <Menu
          title="Well done ! "
          actionBar={<Button onClick={quit}>Go back to the quest</Button>}
          highlightTitle={false}
        >
          <p>
            You passed the quiz. Congratulations on your efforts and progress!
            Keep up the good work and continue to explore new challenges.
          </p>
          <img src="/icons/success.svg" alt="success" width="255" />
        </Menu>
      </div>
    </>
  );
};

export default EndScreen;
