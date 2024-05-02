import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, spices, ingredients, steps, tags } = req.body;

  const session = await getServerSession(req, res, authOptions);
  console.log("session", session);
  const result = await prisma.recipe.create({
    data: {
      title: title,
      author: { connect: { email: session?.user?.email } },
      spices: spices,
      instructions: steps,
      ingredients: {
        create: ingredients,
      },
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
  res.json(result);
}
