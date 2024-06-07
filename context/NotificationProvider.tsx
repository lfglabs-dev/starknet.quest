import React, { createContext, useState, useContext, ReactNode } from "react";
import { Snackbar, SnackbarContent, IconButton, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";

const NotificationContentRoot = styled(SnackbarContent)(() => ({
  backgroundColor: "black",
}));

const IconButtonRoot = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

interface NotificationProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

interface NotificationContextProps {
  showNotification: (message: string, type?: NotificationProps["type"]) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<NotificationProps>({
    type: "info",
    message: "",
    open: false,
    onClose: () => hideNotification(),
    autoHideDuration: 6000,
  });

  const showNotification = (
    message: string,
    type: NotificationProps["type"]
  ) => {
    setNotification({
      message,
      type,
      open: true,
      onClose: () => hideNotification(),
      autoHideDuration: 6000,
    });
  };

  const hideNotification = () => {
    setNotification((prevNotification) => ({
      ...prevNotification,
      open: false,
    }));
  };

  const renderIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckIcon width="20" color="#6AFFAF" />;
      case "error":
        return <ErrorIcon style={{ color: "red" }} />;
      case "warning":
        return <ErrorIcon style={{ color: "orange" }} />;
      case "info":
        return <InfoIcon style={{ color: "yellow" }} />;
      default:
        return <InfoIcon style={{ color: "white" }} />;
    }
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={notification.onClose}
      >
        <NotificationContentRoot
          className={notification.type}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className="text-white flex gap-2">
              {renderIcon()}
              {notification.message}
            </span>
          }
          action={[
            <IconButtonRoot
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={notification.onClose}
            >
              <CloseIcon />
            </IconButtonRoot>,
          ]}
        />
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// Sample function for the notification context
// const { showNotification} = useNotification();

// const handleClick = () => {
//   showNotification('This is a success message!', 'success');
//   console.log('Notification opened')
// };
