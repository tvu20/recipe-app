import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "../../../lib/prisma";

// POST /api/comment
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { comment, id } = req.body;

  const session = await getServerSession(req, res, authOptions);

  const result = await prisma.comment.create({
    data: {
      message: comment,
      author: { connect: { email: session?.user?.email } },
      recipe: { connect: { id: id } },
    },
  });

  res.json(result);
}
