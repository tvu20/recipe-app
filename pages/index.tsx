import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Router from "next/router";

export default function Home() {
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
        // console.log(data);
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

  const renderRecipes = () => {
    return recipes.map((recipe) => {
      return (
        <div
          key={recipe.id}
          onClick={() => Router.push("/recipe/[id]", `/recipe/${recipe.id}`)}
        >
          {recipe.title}
        </div>
      );
    });
  };

  return <Layout>{renderRecipes()}</Layout>;
}
