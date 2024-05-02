import React, { useState } from "react";

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
        <div key={i}>
          <li>{item}</li>
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
        placeholder={name}
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
      </button>
    </div>
  );
};

export default CreateList;
