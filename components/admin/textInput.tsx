import React from "react";
import styles from "@styles/admin.module.css";

type TextInputProps = {
  value: string | number;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  multiline?: number;
  type?: string;
};

export default function TextInput(props: TextInputProps) {
  const { value, placeholder, onChange, label, name, multiline, type } = props;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      {multiline && multiline > 1 ? (
        <textarea
          className={styles.input}
          name={name}
          cols={40}
          rows={5}
          id={name}
          value={value}
          onChange={(e) =>
            onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          placeholder={placeholder}
        ></textarea>
      ) : (
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
          type={type ?? "text"}
        />
      )}
    </div>
  );
}
