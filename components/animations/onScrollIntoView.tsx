import React, { FunctionComponent } from "react";
import { useInView } from "react-intersection-observer";
import styles from "../../styles/components/animations.module.css";

type OnScrollIntoViewProps = {
  animation?: string;
  children: React.ReactNode;
  callback?: () => void;
};

const OnScrollIntoView: FunctionComponent<OnScrollIntoViewProps> = ({
  animation = "",
  children,
  callback,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-100px 0px",
    onChange: () => callback && callback(),
  });

  return (
    <div
      ref={ref}
      className={`${styles[animation]} ${inView && styles.active}`}
    >
      {children}
    </div>
  );
};

export default OnScrollIntoView;
