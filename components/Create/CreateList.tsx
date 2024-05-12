import React, { useState } from "react";
import { Icon } from "@iconify/react";

import Input from "../Input/Input";
import TextArea from "../Input/TextArea";

import styles from "../../styles/Input.module.css";

type Props = {
  name: string;
  list: String[];
  addItem: (item: any) => void;
  removeItem: (index: any) => void;
};

const CreateList: React.FC<Props> = (props) => {
  const { list, addItem, removeItem, name } = props;
  const [text, setText] = useState("");

  const displayList = () => {
    return list.map((item, i) => {
      return (
        <div key={i} className={styles.listItem}>
          <li>{item}</li>
          <button
            className={styles.deleteBtn}
            type="button"
            onClick={() => removeItem(i)}
          >
            <Icon className={styles.deleteIcon} icon="basil:cross-solid" />
          </button>
        </div>
      );
    });
  };

  const displaySteps = () => {
    return list.map((item, i) => {
      return (
        <div key={i} className={styles.listItem} style={{ width: "70vw" }}>
          <li>{item}</li>
          <button
            className={styles.deleteBtn}
            type="button"
            onClick={() => removeItem(i)}
          >
            <Icon className={styles.deleteIcon} icon="basil:cross-solid" />
          </button>
        </div>
      );
    });
  };

  return (
    <div>
      {name !== "Step" && <ul>{displayList()}</ul>}
      {name === "Step" && <ol>{displaySteps()}</ol>}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-end",
        }}
      >
        {name !== "Step" && (
          <Input
            autoFocus
            onChange={setText}
            placeholder={name}
            value={text}
            small
          />
        )}
        {name === "Step" && (
          <TextArea
            onChange={setText}
            placeholder="Describe a step of the recipe"
            value={text}
            small
            width="70vw"
          />
        )}
        <button
          className="add-btn"
          type="button"
          onClick={() => {
            addItem(text);
            setText("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CreateList;
