import React from "react";
import prisma from "../../lib/prisma";

export const getServerSideProps = async ({ params }) => {
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      ingredients: true,
      tags: true,
    },
  });
  return {
    props: { recipe: JSON.stringify(recipe) },
  };
};

const Recipe = ({ recipe }) => {
  return <div>{recipe}</div>;
};

export default Recipe;
