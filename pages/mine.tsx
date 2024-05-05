import React from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import Router from "next/router";
import prisma from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      author: { email: session.user.email },
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { recipes: JSON.parse(JSON.stringify(recipes)) },
  };
};

type Props = {
  recipes: any;
};

const Mine: React.FC<Props> = ({ recipes }) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Recipes</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Recipes</h1>
        <main>
          {recipes.map((recipe) => (
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
      </div>
      <style jsx>{`
        .post {
          background: var(--geist-background);
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Mine;
