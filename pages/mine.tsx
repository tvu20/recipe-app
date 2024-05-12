import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import Router from "next/router";

import RecipeGrid from "../components/Recipes/RecipeGrid";

import styles from "../styles/home.module.css";

const Mine: React.FC = () => {
  const { data: session, status } = useSession();

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    const userHasValidSession = Boolean(session);
    if (!userHasValidSession) {
      Router.push("/");
    }

    fetch(`/api/recipes/mine`, {
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
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <div className={styles.header}>
          <h1>
            My <span className={styles.special}>Recipe</span> App
          </h1>
        </div>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  if (!recipes) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className={styles.headerAlt}>
        <h1>My Recipes</h1>
      </div>
      <RecipeGrid recipes={recipes} />

      {/* <div className="page">
        <h1>My Recipes</h1>
        <main>
          {recipes?.map((recipe) => (
            <div
              key={recipe.id}
              className="post"
              onClick={() =>
                Router.push("/recipe/[id]", `/recipe/${recipe.id}`)
              }
            >
              <p>{recipe.title}</p>
            </div>
          ))}
        </main>
      </div> */}
    </Layout>
  );
};

export default Mine;
