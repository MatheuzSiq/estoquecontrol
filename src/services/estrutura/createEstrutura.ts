import { prisma } from "@/lib/prisma";

type CreateEstruturaParams = {
  galpaoId: string;
  ruaInicio: string;
  ruaFim: string;
  posicaoInicio: number;
  posicaoFim: number;
  nivelInicio: string;
  nivelFim: string;
};

export async function createEstrutura(params: CreateEstruturaParams) {
  const {
    galpaoId,
    ruaInicio,
    ruaFim,
    posicaoInicio,
    posicaoFim,
    nivelInicio,
    nivelFim,
  } = params;

  const ruas: string[] = [];
  const niveis: string[] = [];

  for (let i = ruaInicio.charCodeAt(0); i <= ruaFim.charCodeAt(0); i++) {
    ruas.push(String.fromCharCode(i));
  }

  for (let i = nivelInicio.charCodeAt(0); i <= nivelFim.charCodeAt(0); i++) {
    niveis.push(String.fromCharCode(i));
  }

  for (const rua of ruas) {
    const ruaCreated = await prisma.rua.create({
      data: {
        name: rua,
        galpaoId: galpaoId,
      },
    });

    for (let pos = posicaoInicio; pos <= posicaoFim; pos++) {
      const posicaoCreated = await prisma.posicao.create({
        data: {
          posicao: pos.toString(),
          ruaId: ruaCreated.id,
        },
      });

      for (const nivel of niveis) {
        await prisma.nivel.create({
          data: {
            nivel,
            posicaoId: posicaoCreated.id,
          },
        });
      }
    }
  }

  return { success: true };
}
