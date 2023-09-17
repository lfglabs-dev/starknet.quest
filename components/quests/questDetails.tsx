import React, { FunctionComponent, useEffect } from "react";
import { QuestDocument } from "../../types/backTypes";
import ScreenLayout from "./screenLayout";
import QuestMenu from "./questMenu";

type QuestDetailsProps = {
  quest: QuestDocument;
  close: () => void;
};

const QuestDetails: FunctionComponent<QuestDetailsProps> = ({
  quest,
  close,
}) => {
  useEffect(() => {
    const documentBody = document.querySelector("body");
    if (!documentBody) return;
    // Mount
    documentBody.style.overflow = "hidden";
    // Scroll to top
    window.scrollTo(0, 0);
    // Unmount
    return () => {
      documentBody.style.removeProperty("overflow");
    };
  }, []);

  return (
    <ScreenLayout close={close}>
      <QuestMenu quest={quest} />
    </ScreenLayout>
  );
};

export default QuestDetails;
