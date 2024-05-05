import React from "react";
import prisma from "../../lib/prisma";

import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import Router from "next/router";

export const getServerSideProps = async ({ params }) => {
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      ingredients: true,
      tags: true,
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: { recipe: JSON.parse(JSON.stringify(recipe)) },
  };
};

const Recipe = ({ recipe }) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === recipe.author?.email;

  return (
    <Layout>
      <div>
        {recipe?.title}
        {userHasValidSession && postBelongsToUser && (
          <button
            onClick={() => Router.push("/edit/[id]", `/edit/${recipe.id}`)}
          >
            Edit
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Recipe;
