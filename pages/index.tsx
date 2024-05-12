import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Tag from "../components/Tags/Tag";
import Input from "../components/Input/Input";
import RecipeGrid from "../components/Recipes/RecipeGrid";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [tags, setTags] = useState([]);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    if (!recipes) return;

    let temp = [...recipes];

    if (search !== "" || search.length > 0) {
      temp = temp.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.length > 0) {
      filters.forEach((tag) => {
        temp = temp.filter((r) => r.tags.includes(tag));
      });
    }
    setDisplayed(temp);
  }, [search, recipes, filters]);

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
        let dataFormatted = data.map((recipe) => {
          let temp = { ...recipe };
          temp.tags = temp.tags.map((t) => t.name);
          return temp;
        });

        setRecipes(dataFormatted);
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

  const addFilter = (item) => {
    setFilters((prevState) => [...prevState, item]);
  };

  const removeFilter = (item) => {
    setFilters((prevState) => prevState.filter((t) => t !== item));
  };

  const renderTags = () => {
    return tags.map((t) => {
      return (
        <Tag
          key={t.name}
          name={t.name}
          addItem={addFilter}
          removeItem={removeFilter}
        ></Tag>
      );
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
      <RecipeGrid recipes={displayed} />
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
