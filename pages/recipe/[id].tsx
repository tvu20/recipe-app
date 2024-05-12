import React, { useState } from "react";
import prisma from "../../lib/prisma";
import { Icon } from "@iconify/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import Router from "next/router";

import useMediaQuery from "../../utils/useMediaQuery";

import Tag from "../../components/Tags/Tag";
import Layout from "../../components/Layout";
import CommentCard from "../../components/Comment/Comment";
import TextArea from "../../components/Input/TextArea";

import styles from "../../styles/Home.module.css";

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
  const [showModal, setShowModal] = useState(false);

  const isBreakpoint = useMediaQuery(800);

  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === recipe.author?.email;

  const displayTags = () => {
    return recipe?.tags.map((t) => {
      return <Tag key={t.name} name={t.name} disabled></Tag>;
    });
  };

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

  const displayModal = () => {
    setShowModal((prevState) => !prevState);
  };

  const displayComments = () => {
    return recipe?.comments.map((c, i) => {
      return <CommentCard key={i} comment={c} deleteComment={deleteComment} />;
    });
  };

  const submitComment = async (e: React.SyntheticEvent) => {
    console.log("submitting comment");
    e.preventDefault();
    try {
      const body = { comment, id: recipe.id };
      await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setComment("");
      Router.replace(Router.asPath);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (e: React.SyntheticEvent, id: string) => {
    console.log("deleting comment");
    e.preventDefault();

    try {
      await fetch(`/api/comment/${id}`, {
        method: "DELETE",
      });
      await Router.replace(Router.asPath);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRecipe = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("delete");
    try {
      await fetch(`/api/recipe/${recipe.id}`, {
        method: "DELETE",
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const renderModal = () => {
    return (
      <div className={styles.modalBg}>
        <div className={styles.modal}>
          <p>Are you sure you want to permanently delete this recipe?</p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={deleteRecipe}
              className={`${styles.delete2Button} ${styles.modalBtn}`}
            >
              Delete
            </button>
            <button
              onClick={displayModal}
              className={`${styles.cancelButton} ${styles.modalBtn}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {showModal && renderModal()}

      <div className={styles.headerAlt}>
        <div className={styles.recipeTitle}>
          <h1>{recipe?.title}</h1>
          {userHasValidSession && postBelongsToUser && (
            <div>
              <button
                onClick={() => Router.push("/edit/[id]", `/edit/${recipe.id}`)}
                className={styles.editButton}
              >
                {isBreakpoint ? (
                  <Icon icon="iconamoon:edit" className={styles.icon} />
                ) : (
                  "Edit"
                )}
              </button>
              <button onClick={displayModal} className={styles.deleteButton}>
                {isBreakpoint ? (
                  <Icon
                    icon="material-symbols:delete-outline"
                    className={styles.icon}
                  />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          )}
        </div>
        <div className={styles.tagContainer}>{displayTags()}</div>
      </div>

      <div className={styles.content}>
        <h3>Ingredients</h3>
        <ul>{displayIngredients()}</ul>
        <h3>Seasonings</h3>
        <ul>{displaySpices()}</ul>
        <h3>Instructions</h3>

        <ol>{displaySteps()}</ol>
        <h3>Notes</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{recipe?.notes}</p>

        {userHasValidSession && (
          <>
            <h4>Comments</h4>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: "30px",
              }}
            >
              <TextArea
                width="100%"
                value={comment}
                onChange={setComment}
                placeholder="Add a comment"
                small
              />
              <button
                className="add-btn"
                type="button"
                onClick={submitComment}
                disabled={!comment}
              >
                Add
              </button>
            </div>
            {displayComments()}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Recipe;
