import React, { useState } from "react";
import Router from "next/router";

import Tag from "../Tags/Tag";

import styles from "../../styles/recipe.module.css";

type Props = {
  recipe: any;
};

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  const renderTags = () => {
    return recipe?.tags.map((t) => {
      return <Tag name={t.name} disabled></Tag>;
    });
  };

  return (
    <div
      className={styles.card}
      key={recipe.id}
      onClick={() => Router.push("/recipe/[id]", `/recipe/${recipe.id}`)}
    >
      <h2>{recipe.title}</h2>
      <div className={styles.tagContainer}>{renderTags()}</div>
    </div>
  );
};

export default RecipeCard;
