import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Tag from "../components/Tags/Tag";

import styles from "../styles/home.module.css";
import Input from "../components/Input/Input";
import RecipeGrid from "../components/Recipes/RecipeGrid";

export default function Home() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch(`/api/recipes`, {
      method: "GET",
      mode: "cors",
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
      })
      .catch((error) => console.error(error));

    fetch(`/api/tags`, {
      method: "GET",
      mode: "cors",
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setTags(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const renderTags = () => {
    return tags.map((t) => {
      return <Tag name={t.name}></Tag>;
    });
  };

  return (
    <Layout>
      <div className={styles.header}>
        <h1>
          My <span className={styles.special}>Recipe</span> App
        </h1>
      </div>
      <div className={styles.searchBar}>
        <Input
          search
          onChange={setSearch}
          value={search}
          placeholder="Search for a recipe"
        ></Input>
        <div className={styles.tagsContainer}>{renderTags()}</div>
      </div>
      <RecipeGrid recipes={recipes} />
      {/* <Input
        onChange={setSearch}
        value={search}
        placeholder="Search for a recipe"
      />
      <Input
        small
        onChange={setSearch}
        value={search}
        placeholder="Search for a recipe"
      /> */}
    </Layout>
  );
}
