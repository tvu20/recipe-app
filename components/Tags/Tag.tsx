import React, { useState } from "react";
import { Icon } from "@iconify/react";

import styles from "../../styles/tag.module.css";

type Props = {
  name: String;
  disabled?: boolean;
};

const Tag: React.FC<Props> = ({ name, disabled }) => {
  const [selected, setSelected] = useState(false);

  const clicked = () => {
    setSelected((prevState) => !prevState);
  };

  return (
    <button
      type="button"
      className={`${styles.btn} ${
        selected || disabled ? styles.selected : ""
      } ${disabled ? styles.disabled : ""}`}
      onClick={clicked}
      disabled={disabled}
    >
      <Icon icon="mdi-light:home" className={styles.icon} />
      <p>{name}</p>
    </button>
  );
};

export default Tag;
