import prisma from "../../../lib/prisma";

// GET /api/recipes
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  let recipes = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      tags: true,
    },
  });

  res.status(200).json(recipes);
}
