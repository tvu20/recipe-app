import React, { useState } from "react";

import styles from "../../styles/input.module.css";

type Props = {
  value: string;
  onChange: (string) => void;
  placeholder: string;
  search?: boolean;
  small?: boolean;
};

const Input: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  search,
  small,
}) => {
  return (
    <>
      <input
        className={`${styles.input} ${search ? styles.search : ""} ${
          small ? styles.small : ""
        }`}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </>
  );
};

export default Input;
