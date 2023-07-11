import styles from "../../styles/components/steps.module.css";

const Steps = ({
  subTitleBefore = false,
  steps,
}: {
  subTitleBefore?: boolean;
  steps: Step[];
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        {steps.map((step, index) => (
          <div
            key={"step_card_" + index}
            className={[styles.card, index % 2 && styles.even].join(" ")}
          >
            <img
              className={styles.icon}
              key={"step_icon_" + index}
              src={step.icon}
            />
            <div
              className={[
                styles.cardContent,
                subTitleBefore && styles.subTitleBefore,
              ].join(" ")}
            >
              {[
                <h1 key={`step_${index}_title`} className={styles.title}>
                  {step.title}
                </h1>,
                <h2 key={`step_${index}_subtitle`} className={styles.subtitle}>
                  {step.subtitle}
                </h2>,
              ].sort(() => (subTitleBefore ? -1 : 1))}
              <p className={styles.description}>{step.description}</p>
            </div>
            <img className={styles.banner} src={step.banner} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;
