import React, { FunctionComponent } from "react";
import styles from "../../styles/components/footer.module.css";
import Link from "next/link";

const Footer: FunctionComponent = () => {
  return (
    <div className="relative">
      <footer className={styles.footer}>
        <Link href="/partnership">Partnership</Link>
      </footer>
    </div>
  );
};

export default Footer;
