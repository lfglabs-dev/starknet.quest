import React, { FunctionComponent, useEffect } from "react";
import { QuestDocument } from "../../types/backTypes";
import ScreenLayout from "./screenLayout";
import { useRouter } from "next/router";
import QuestMenu from "./questMenu";

type QuestDetailsProps = {
  quest: QuestDocument;
  setShowMenu: (showMenu: boolean) => void;
};

const QuestDetails: FunctionComponent<QuestDetailsProps> = ({
  quest,
  setShowMenu,
}) => {
  const router = useRouter();

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
    <ScreenLayout setShowMenu={setShowMenu}>
      <>
        <QuestMenu quest={quest} />
      </>
    </ScreenLayout>
  );
};

export default QuestDetails;
