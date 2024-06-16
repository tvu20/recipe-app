import React from "react";

import Tag from "../Tags/Tag";

import { TAGS } from "../../utils/tags";

import styles from "../../styles/Tag.module.css";

type Props = {
  list: String[];
  addItem: (item: any) => void;
  removeItem: (index: any) => void;
};

const CreateTag: React.FC<Props> = (props) => {
  const { list, addItem, removeItem } = props;

  const displayList = () => {
    return TAGS.map((item, i) => {
      return (
        <Tag
          name={item}
          key={i}
          addItem={addItem}
          removeItem={removeItem}
          includes={list.includes(item)}
        />
      );
    });
  };

  return (
    <div>
      <div className={styles.tagContainer}>{displayList()}</div>
      {/* <input
        autoFocus
        onChange={(e) => setText(e.target.value)}
        placeholder="Tag"
        type="text"
        value={text}
      />
      <button
        type="button"
        onClick={() => {
          addItem(text);
          setText("");
        }}
      >
        Enter
      </button> */}
    </div>
  );
};

export default CreateTag;
