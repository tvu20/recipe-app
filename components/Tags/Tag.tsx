import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

import styles from "../../styles/tag.module.css";
import { TAG_ICONS } from "../../utils/tags";

type Props = {
  name: string;
  disabled?: boolean;
  filled?: boolean;
  addItem?: (text: string) => void;
  removeItem?: (text: string) => void;
  includes?: boolean;
};

const Tag: React.FC<Props> = ({
  name,
  disabled,
  filled,
  addItem,
  removeItem,
  includes,
}) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selected !== includes) {
      setSelected(includes);
    }
  }, [includes]);

  const clicked = () => {
    if (disabled) return;

    if (selected) {
      removeItem(name);
    } else {
      addItem(name);
    }

    setSelected((prevState) => !prevState);
  };

  return (
    <button
      type="button"
      className={`${styles.btn} ${selected || filled ? styles.selected : ""} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={clicked}
      disabled={disabled}
    >
      <Icon
        icon={TAG_ICONS[name] ? TAG_ICONS[name] : "streamline:pork-meat"}
        className={styles.icon}
      />
      <p>{name}</p>
    </button>
  );
};

export default Tag;
