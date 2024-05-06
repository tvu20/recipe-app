import prisma from "../lib/prisma";

import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Router from "next/router";

// import Head from "next/head";
// import styles from "../styles/Home.module.css";

export const getStaticProps: GetStaticProps = async () => {
  let recipes = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      tags: true,
    },
  });
  let tags = await prisma.tag.findMany();

  return {
    props: { recipes: JSON.stringify(recipes), tags: tags },
    revalidate: 30,
  };
};

export default function Home({ recipes, tags }) {
  const renderRecipes = () => {
    const parsed = JSON.parse(recipes);

    return parsed.map((recipe) => {
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
