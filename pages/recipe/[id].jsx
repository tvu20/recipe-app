import React, { useState } from "react";
import prisma from "../../lib/prisma";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import Router from "next/router";

export const getServerSideProps = async (ctx) => {
  const { params } = ctx;
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  const email = session?.user.email || "";

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
      comments: {
        where: { author: { is: { email: email } } },
        include: {
          author: {
            select: { email: true },
          },
        },
      },
    },
  });

  return {
    props: {
      recipe: JSON.parse(JSON.stringify(recipe)),
    },
  };
};

const Recipe = ({ recipe }) => {
  const [comment, setComment] = useState("");

  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  if (!recipe) {
    return <div>Loading...</div>;
  }

  console.log(recipe);

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === recipe.author?.email;

  const displayIngredients = () => {
    return recipe?.ingredients.map((item, i) => {
      return (
        <li key={i}>
          {item.name}: {item.quantity}
        </li>
      );
    });
  };

  const displaySpices = () => {
    return recipe?.spices.map((item, i) => {
      return <li key={i}>{item}</li>;
    });
  };

  const displaySteps = () => {
    return recipe?.instructions.map((item, i) => {
      return <li key={i}>{item}</li>;
    });
  };

  const displayComments = () => {
    return recipe?.comments.map((c, i) => {
      return (
        <div key={i}>
          <p>{c.message}</p>
        </div>
      );
    });
  };

  return (
    <Layout>
      <div>
        <h1>{recipe?.title}</h1>
        {userHasValidSession && postBelongsToUser && (
          <button
            onClick={() => Router.push("/edit/[id]", `/edit/${recipe.id}`)}
          >
            Edit
          </button>
        )}
        <h2>Ingredients</h2>
        <ul>{displayIngredients()}</ul>
        <h3>Seasonings</h3>
        <ul>{displaySpices()}</ul>
        <h2>Instructions</h2>

        <ol>{displaySteps()}</ol>
        <h3>Notes</h3>
        <p>{recipe?.notes}</p>

        {userHasValidSession && (
          <>
            <h2>Comments</h2>
            <textarea
              cols={50}
              rows={8}
              autoFocus
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              value={comment}
            />
            <button type="button">Add comment</button>
            {displayComments()}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Recipe;
