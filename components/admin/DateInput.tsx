import React from "react";
import styles from "@styles/admin.module.css";

type Props = {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
};

export default function Dateinput(props: Props) {
  const { value, placeholder, onChange, label, name } = props;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.dateInput}
        type="date"
      />
    </div>
  );
}
