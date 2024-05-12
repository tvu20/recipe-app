import React, { useState, useEffect } from "react";
import Router from "next/router";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";

import Layout from "../../components/Layout";
import CreateList from "../../components/Create/CreateList";
import CreateIngredient from "../../components/Create/CreateIngredient";
import CreateTag from "../../components/Create/CreateTag";
import Input from "../../components/Input/Input";
import TextArea from "../../components/Input/TextArea";

import styles from "../../styles/Home.module.css";

type Props = {
  recipe: any;
  id: any;
};

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
    props: { recipe: JSON.parse(JSON.stringify(recipe)), id: params?.id },
  };
};

const Edit: React.FC<Props> = ({ recipe, id }) => {
  const [title, setTitle] = useState("");
  const [spices, setSpices] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState("");

  //   // auth stuff
  const { data: session, status } = useSession();

  if (!recipe) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    // authentication stuff
    if (status === "loading") return;

    const userHasValidSession = Boolean(session);
    const postBelongsToUser = session?.user?.email === recipe.author?.email;

    if (!userHasValidSession || !postBelongsToUser) {
      Router.push("/");
    }

    setTitle(recipe.title);
    setNotes(recipe.notes);
    setSpices(recipe.spices);
    setSteps(recipe.instructions);

    const ings = recipe.ingredients.map((ing) => {
      return { name: ing.name, quantity: ing.quantity, id: ing.id };
    });

    setIngredients(ings);

    const ts = recipe.tags.map((ing) => {
      return ing.name;
    });

    setTags(ts);
  }, [session, status, recipe]);

  const addSpice = (item) => {
    setSpices((prevState) => [...prevState, item]);
  };

  const removeSpice = (index) => {
    setSpices((prevState) => prevState.filter((_, i) => i !== index));
  };

  const addIngredient = (item) => {
    setIngredients((prevState) => [...prevState, item]);
  };

  const removeIngredient = (index) => {
    setIngredients((prevState) => prevState.filter((_, i) => i !== index));
  };

  const addStep = (item) => {
    setSteps((prevState) => [...prevState, item]);
  };

  const removeStep = (index) => {
    setSteps((prevState) => prevState.filter((_, i) => i !== index));
  };

  const addTag = (item) => {
    setTags((prevState) => [...prevState, item]);
  };

  const removeTag = (item) => {
    setTags((prevState) => prevState.filter((t) => t !== item));
  };

  const submitData = async (e: React.SyntheticEvent) => {
    console.log("submitting");
    e.preventDefault();

    try {
      const body = { title, spices, ingredients, steps, tags, notes };
      await fetch(`/api/recipe/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/recipe/[id]", `/recipe/${recipe.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // const deleteData = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   console.log("delete");
  //   try {
  //     await fetch(`/api/recipe/${id}`, {
  //       method: "DELETE",
  //     });
  //     await Router.push("/");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <Layout>
      <div className={styles.formContainer}>
        <form onSubmit={submitData}>
          <h1>Edit Recipe</h1>

          <h3>Name of Dish</h3>
          <Input
            autoFocus
            value={title}
            onChange={setTitle}
            placeholder="Carrot Cake"
            width="70vw"
          />

          <div className={styles.spacer}></div>

          <h3>Ingredients</h3>
          <CreateIngredient
            list={ingredients}
            addItem={addIngredient}
            removeItem={removeIngredient}
          />
          <div className={styles.spacer}></div>

          <h3>Seasonings</h3>
          <CreateList
            name="Name"
            list={spices}
            addItem={addSpice}
            removeItem={removeSpice}
          />

          <div className={styles.spacer}></div>

          <h3>Instructions</h3>
          <CreateList
            name="Step"
            list={steps}
            addItem={addStep}
            removeItem={removeStep}
          />

          <div className={styles.spacer}></div>

          <h3 style={{ marginBottom: "10px" }}>Notes</h3>
          <TextArea
            onChange={setNotes}
            placeholder="Additional information"
            value={notes}
            small
            width="70vw"
          />

          <div className={styles.spacer}></div>

          <h3 style={{ marginBottom: "5px" }}>Tags</h3>
          <p style={{ margin: "0 0 10px" }}>Select all that apply.</p>

          <CreateTag list={tags} addItem={addTag} removeItem={removeTag} />

          <input
            disabled={!title}
            type="submit"
            value="Save"
            className={styles.submitButton}
          />
          <button
            className={styles.cancel2Button}
            type="button"
            onClick={() => Router.push("/recipe/[id]", `/recipe/${recipe.id}`)}
          >
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Edit;
