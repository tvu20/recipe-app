import React, { useState } from "react";
import { Icon } from "@iconify/react";

import Input from "../Input/Input";

import styles from "../../styles/input.module.css";

type Props = {
  list: { name: string; quantity: string }[];
  addItem: (item: any) => void;
  removeItem: (index: any) => void;
};

const CreateIngredient: React.FC<Props> = (props) => {
  const { list, addItem, removeItem } = props;
  const [text, setText] = useState("");
  const [qty, setQty] = useState("");

  const displayList = () => {
    return list.map((item, i) => {
      return (
        <div key={i} className={styles.listItem}>
          <li>
            {item.name}: {item.quantity}
          </li>
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
      <ul>{displayList()}</ul>
      <Input
        autoFocus
        onChange={setText}
        placeholder="Name"
        value={text}
        small
        width="200px"
      />
      <Input
        marginLeft="15px"
        onChange={setQty}
        placeholder="Quantity"
        value={qty}
        small
        width="100px"
      />
      <button
        className="add-btn"
        type="button"
        onClick={() => {
          addItem({ name: text, quantity: qty });
          setText("");
          setQty("");
        }}
      >
        Add
      </button>
    </div>
  );
};

export default CreateIngredient;
