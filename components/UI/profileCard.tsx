import React, { FunctionComponent } from "react";
import styles from "../../styles/profile.module.css";

const ProfileCard: FunctionComponent<ProfileCard> = ({
  title,
  content,
  isUppercase = false,
}) => {
  return (
    <div className={styles.profileCard}>
      <h2 className={`${styles.title} ${isUppercase ? "uppercase" : ""}`}>
        {title}
      </h2>
      <div className={styles.divider} />
      {content}
    </div>
  );
};

export default ProfileCard;
