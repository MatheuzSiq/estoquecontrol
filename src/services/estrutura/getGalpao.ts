import { prisma } from "@/lib/prisma";

export async function getGalpoes() {
  return prisma.galpao.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
