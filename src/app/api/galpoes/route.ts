import { prisma } from "@/lib/prisma";
import { createGalpao } from "@/services/estrutura/createGalpao";

export async function GET() {
  const galpoes = await prisma.galpao.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(galpoes);
}

export async function POST(req: Request) {
  const body = await req.json();

  const result = await createGalpao({
    galpao: body.galpao,
    description: body.description,
  });

  return Response.json(result);
}
