import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "../../../lib/prisma";

// GET /api/recipes
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403);
  } else {
    const result = await prisma.recipe.findMany({
      where: {
        author: { email: session.user.email },
      },
      include: {
        author: {
          select: { name: true },
        },
        tags: true,
      },
    });
    res.status(200).json(result);
  }
}
