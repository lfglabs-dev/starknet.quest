import { useInView } from "react-intersection-observer";
import styles from "../../styles/components/animations.module.css";

const OnScrollIntoView = ({
  animation = "",
  children,
  callback,
}: {
  animation?: string;
  children: React.ReactNode;
  callback?: () => void;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-100px 0px",
    onChange: (inView) => callback && callback(),
  });

  return (
    <div
      ref={ref}
      className={[
        styles.onScrollIntoView,
        styles[animation],
        inView ? styles.active : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
};

export default OnScrollIntoView;
