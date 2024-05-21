import { Snackbar } from "@mui/material";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Slide, { SlideProps } from "@mui/material/Slide";

function SlideTransition(props: SlideProps) {
  return (
    <Slide
      style={{
        background: "linear-gradient(var(--background600), #000)",
        borderRadius: "8px",
        color: "var(--text)",
      }}
      {...props}
      direction="up"
    />
  );
}

const initialState = {
  showMessage: (content, duration = 2000, onClose = () => {}) => {},
  hideMessage: () => {},
};

export const InfoBarContext = createContext(initialState);

export const InfoBarProvider = (props) => {
  let timer;
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState(2000);
  const showMessage = useCallback((content, duration = 2000, onClose) => {
    setContent(content);
    setDuration(duration);
  }, []);

  const hideMessage = useCallback(() => {
    setContent("");
  }, []);

  const value = useMemo(
    () => ({
      hideMessage,
      showMessage,
    }),
    [content]
  );

  return (
    <InfoBarContext.Provider value={value} {...props}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={content.length > 0}
        onClose={hideMessage}
        message={content}
        key={"bottom-right"}
        autoHideDuration={duration}
        TransitionComponent={SlideTransition}
      />
      {props.children}
    </InfoBarContext.Provider>
  );
};

export const useInfoBar = () => {
  const context = useContext(InfoBarContext);
  if (context === undefined) {
    throw new Error("useInfoBar must be used within a InfoBarProvider");
  }
  return context;
};
