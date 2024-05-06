import prisma from "../../../lib/prisma";

// DELETE /api/post/:id
export default async function handle(req, res) {
  const recipeId = req.query.id;
  const { title, spices, ingredients, steps, tags, notes } = req.body;

  //   const session = await getServerSession(req, res, authOptions);

  // put method - updating recipe
  if (req.method === "PUT") {
    // disconnecting previous ingredients and tags
    await prisma.recipe.update({
      where: { id: parseInt(recipeId) },
      data: {
        ingredients: {
          set: [],
        },
        tags: {
          set: [],
        },
      },
    });

    const result = await prisma.recipe.update({
      where: { id: parseInt(recipeId) },
      data: {
        title: title,
        spices: spices,
        instructions: steps,
        ingredients: {
          connectOrCreate: ingredients.map((ing) => {
            return {
              where: {
                id: ing.id || -1,
                OR: [{ name: ing.name, quantity: ing.quantity }],
              },
              create: { name: ing.name, quantity: ing.quantity },
            };
          }),
        },
        notes: notes,
        tags: {
          connectOrCreate: tags.map((tag) => {
            return {
              where: { name: tag },
              create: { name: tag },
            };
          }),
        },
      },
    });

    // remove unused ingredients
    await prisma.ingredient.deleteMany({
      where: {
        recipeId: null,
      },
    });

    res.json(result);
  } else if (req.method === "DELETE") {
    const post = await prisma.recipe.delete({
      where: { id: parseInt(recipeId) },
    });
    await prisma.ingredient.deleteMany({
      where: {
        recipeId: null,
      },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
