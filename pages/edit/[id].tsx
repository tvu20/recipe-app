import React, { useState, useEffect } from "react";
import Router from "next/router";
import prisma from "../../lib/prisma";

import { useSession } from "next-auth/react";

import Layout from "../../components/Layout";
import CreateList from "../../components/Create/CreateList";
import CreateIngredient from "../../components/Create/CreateIngredient";
import CreateTag from "../../components/Create/CreateTag";

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

  //   useEffect(() => {}, [recipe]);

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

  const removeTag = (index) => {
    setTags((prevState) => prevState.filter((_, i) => i !== index));
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
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("delete");
    try {
      await fetch(`/api/recipe/${id}`, {
        method: "DELETE",
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>Edit Recipe</h1>

          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />

          <CreateIngredient
            list={ingredients}
            addItem={addIngredient}
            removeItem={removeIngredient}
          />

          <CreateList
            name="Spices"
            list={spices}
            addItem={addSpice}
            removeItem={removeSpice}
          />

          <CreateList
            name="Step"
            list={steps}
            addItem={addStep}
            removeItem={removeStep}
          />

          <textarea
            cols={50}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
            rows={8}
            value={notes}
          />

          <CreateTag list={tags} addItem={addTag} removeItem={removeTag} />

          <input disabled={!title} type="submit" value="Save" />
          <button type="button" onClick={deleteData}>
            Delete
          </button>
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Edit;
