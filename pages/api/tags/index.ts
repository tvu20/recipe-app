import prisma from "../../../lib/prisma";

// GET /api/recipes
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  let tags = await prisma.tag.findMany();

  res.status(200).json(tags);
}
