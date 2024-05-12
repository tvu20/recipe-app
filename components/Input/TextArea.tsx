import React from "react";

import styles from "../../styles/Input.module.css";

type Props = {
  value: string;
  onChange: (string) => void;
  placeholder: string;
  search?: boolean;
  small?: boolean;
  width?: string;
};

const TextArea: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  small,
  width,
}) => {
  return (
    <>
      <textarea
        style={{ width: width ? width : "" }}
        className={`${styles.input} ${small ? styles.small : ""}`}
        cols={50}
        rows={5}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </>
  );
};

export default TextArea;
