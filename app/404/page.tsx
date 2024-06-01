import React from "react";
import styles from "@styles/Home.module.css";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

export default function Page() {
  return (
    <div className={styles.screen404}>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Typography type={TEXT_TYPE.H1} color="transparent" className="title">404 - Page Not Found</Typography>
          <p className="mt-2">The page you are looking for does not exist.</p>
        </div>
      </div>
    </div>
  );
}
