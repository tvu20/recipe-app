import prisma from "../lib/prisma";

import Header from "../components/Header";

import { GetStaticProps } from "next";
import Layout from "../components/Layout";

// import Head from "next/head";
// import styles from "../styles/Home.module.css";

export const getStaticProps: GetStaticProps = async () => {
  let recipes = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      tags: true,
    },
  });
  return { props: { recipes: JSON.stringify(recipes) } };
};

export default function Home({ recipes }) {
  return <Layout>{recipes}</Layout>;
}
