import React, { useState } from "react";

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
        <div key={i}>
          <li>
            {item.name}: {item.quantity}
          </li>
          <button type="button" onClick={() => removeItem(i)}>
            Delete
          </button>
        </div>
      );
    });
  };

  return (
    <div>
      <ul>{displayList()}</ul>
      <input
        autoFocus
        onChange={(e) => setText(e.target.value)}
        placeholder="Ingredient name"
        type="text"
        value={text}
      />
      <input
        autoFocus
        onChange={(e) => setQty(e.target.value)}
        placeholder="Quantity"
        type="text"
        value={qty}
      />
      <button
        type="button"
        onClick={() => {
          addItem({ name: text, quantity: qty });
          setText("");
          setQty("");
        }}
      >
        Enter
      </button>
    </div>
  );
};

export default CreateIngredient;
