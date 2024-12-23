import React from "react";
import Button from "@components/UI/button";
import { useNotification } from "@context/NotificationProvider";
import { AdminService } from "@services/authService";

type QuestUsersButtonProps = {
  questId: string;
};

const DownloadQuestUsersButton: React.FC<QuestUsersButtonProps> = ({ questId }) => {
  const { showNotification } = useNotification();

  const handleDownload = async () => {
    try {
      const data = await AdminService.getQuestUsersByQuestId({ id: Number(questId) });

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quest_${questId}_users.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading quest users:", error);
      showNotification("Failed to download quest users.", "error");
    }
  };

  return (
    <Button onClick={handleDownload}>
      <p>Download quest users</p>
    </Button>
  );
};

export default DownloadQuestUsersButton;