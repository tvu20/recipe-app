import React, { useState } from "react";
import Router from "next/router";

import RecipeCard from "./RecipeCard";

import styles from "../../styles/recipe.module.css";

type Props = {
  recipes: any;
};

const RecipeGrid: React.FC<Props> = ({ recipes }) => {
  const renderRecipes = () => {
    return recipes.map((recipe) => {
      return <RecipeCard recipe={recipe}></RecipeCard>;
    });
  };

  return <div className={styles.container}>{renderRecipes()}</div>;
};

export default RecipeGrid;
