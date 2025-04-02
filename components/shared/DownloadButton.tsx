import React from "react";
import { useNotification } from "@context/NotificationProvider";
import Button from "@components/UI/button";
interface DownloadButtonProps {
  label: string;
  endpoint: () => Promise<string>;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ label, endpoint }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { showNotification } = useNotification();
  const abortControllerRef = React.useRef<AbortController>();

  const handleDownload = async () => {
    setIsLoading(true);
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    try {
      const response = await endpoint();

      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${label}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
      showNotification("Download failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <Button onClick={handleDownload} disabled={isLoading}>
      {isLoading ? "Downloading..." : label}
    </Button>
  );
};

export default DownloadButton;
