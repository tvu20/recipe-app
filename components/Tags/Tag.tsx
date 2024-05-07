import React, { useState } from "react";

import styles from "../../styles/tag.module.css";

type Props = {
  name: String;
};

const Tag: React.FC<Props> = ({ name }) => {
  const [selected, setSelected] = useState(false);

  return (
    <button
      type="button"
      className={`${styles.btn} ${selected ? styles.selected : ""}`}
    >
      {name}
    </button>
  );
};

export default Tag;
