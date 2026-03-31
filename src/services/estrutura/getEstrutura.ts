import { prisma } from "@/lib/prisma";

export async function getEstrutura() {
  const galpoes = await prisma.galpao.findMany({
    include: {
      ruas: {
        include: {
          posicoes: {
            include: {
              niveis: {
                include: {
                  inventory: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const enderecos: any[] = [];

  for (const galpao of galpoes) {
    for (const rua of galpao.ruas) {
      for (const posicao of rua.posicoes) {
        for (const nivel of posicao.niveis) {
          const ocupado = nivel.inventory.some((i) => i.quantity > 0);

          enderecos.push({
            id: nivel.id,
            galpao: galpao.name,
            rua: rua.name,
            posicao: posicao.posicao,
            nivel: nivel.nivel,
            ocupado,
          });
        }
      }
    }
  }

  // Ordenar os endereços
  const enderecosOrdenados = enderecos.sort((a, b) => {
    // Primeiro por rua
    if (a.rua < b.rua) return -1;
    if (a.rua > b.rua) return 1;

    // Se rua for igual, por posição
    // Tenta converter para número para ordenação numérica
    const posA = parseFloat(a.posicao);
    const posB = parseFloat(b.posicao);
    if (!isNaN(posA) && !isNaN(posB)) {
      if (posA !== posB) return posA - posB;
    } else {
      // Se não for número, ordena como string
      if (a.posicao < b.posicao) return -1;
      if (a.posicao > b.posicao) return 1;
    }

    // Se posição for igual, por nível
    const nivelA = parseFloat(a.nivel);
    const nivelB = parseFloat(b.nivel);
    if (!isNaN(nivelA) && !isNaN(nivelB)) {
      return nivelA - nivelB;
    } else {
      if (a.nivel < b.nivel) return -1;
      if (a.nivel > b.nivel) return 1;
    }

    return 0;
  });

  return enderecosOrdenados;
}
