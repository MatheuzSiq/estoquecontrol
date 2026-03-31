import { prisma } from "@/lib/prisma";

type CreateGalpaoParams = {
  galpao: string;
  description: string;
};

export async function createGalpao(params: CreateGalpaoParams) {
  const { galpao, description } = params;

  const galpaoExistente = await prisma.galpao.findFirst({
    where: { name: galpao },
  });

  if (galpaoExistente) {
    return { success: false, message: "Galpão já existe" };
  }

  const galpaoCreated = await prisma.galpao.create({
    data: {
      name: galpao,
      description: description,
    },
  });

  return {
    success: true,
    galpao: galpaoCreated,
  };
}
