import React from "react";

import RecipeCard from "./RecipeCard";

import styles from "../../styles/recipe.module.css";

type Props = {
  recipes: any;
};

const RecipeGrid: React.FC<Props> = ({ recipes }) => {
  const renderRecipes = () => {
    return recipes.map((recipe) => {
      return <RecipeCard key={recipe.id} recipe={recipe}></RecipeCard>;
    });
  };

  return <div className={styles.container}>{renderRecipes()}</div>;
};

export default RecipeGrid;
