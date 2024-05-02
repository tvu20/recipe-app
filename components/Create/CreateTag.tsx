import React, { useState } from "react";

type Props = {
  list: { name: string; quantity: string }[];
  addItem: (item: any) => void;
  removeItem: (index: any) => void;
};

const CreateTag: React.FC<Props> = (props) => {
  const { list, addItem, removeItem } = props;
  const [text, setText] = useState("");

  const displayList = () => {
    return list.map((item, i) => {
      return (
        <div key={i}>
          <li>{item.name}</li>
          <button onClick={() => removeItem(i)}>Delete</button>
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
        placeholder="Tag"
        type="text"
        value={text}
      />
      <button
        type="button"
        onClick={() => {
          addItem({ name: text });
          setText("");
        }}
      >
        Enter
      </button>
    </div>
  );
};

export default CreateTag;
