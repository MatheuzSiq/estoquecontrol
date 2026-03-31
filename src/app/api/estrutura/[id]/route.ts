import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Buscar um item específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const nivel = await prisma.nivel.findUnique({
      where: { id },
      include: {
        posicao: {
          include: {
            rua: {
              include: {
                galpao: true,
              },
            },
          },
        },
      },
    });

    if (!nivel) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(nivel);
  } catch (error) {
    console.error("Erro ao buscar item:", error);
    return NextResponse.json({ error: "Erro ao buscar item" }, { status: 500 });
  }
}

// DELETE - Excluir um item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    await prisma.nivel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return NextResponse.json(
      { error: "Erro ao deletar estrutura" },
      { status: 500 },
    );
  }
}

// PUT - Editar um item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const data = await request.json();
    const { galpao, rua, posicao, nivel, posicaoId } = data;

    // Busca o nível atual com suas relações
    const nivelAtual = await prisma.nivel.findUnique({
      where: { id },
      include: {
        posicao: {
          include: {
            rua: {
              include: {
                galpao: true,
              },
            },
          },
        },
      },
    });

    if (!nivelAtual) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    let posicaoIdFinal = posicaoId || nivelAtual.posicaoId;
    let ruaId = nivelAtual.posicao.ruaId;
    let galpaoId = nivelAtual.posicao.rua.galpaoId;

    // Verifica se precisa criar/atualizar galpão
    if (galpao && galpao !== nivelAtual.posicao.rua.galpao.name) {
      let galpaoExistente = await prisma.galpao.findFirst({
        where: { name: galpao },
      });

      if (!galpaoExistente) {
        galpaoExistente = await prisma.galpao.create({
          data: { name: galpao },
        });
      }
      galpaoId = galpaoExistente.id;
    }

    // Verifica se precisa criar/atualizar rua
    if (
      rua &&
      (rua !== nivelAtual.posicao.rua.name ||
        galpaoId !== nivelAtual.posicao.rua.galpaoId)
    ) {
      let ruaExistente = await prisma.rua.findFirst({
        where: {
          name: rua,
          galpaoId: galpaoId,
        },
      });

      if (!ruaExistente) {
        ruaExistente = await prisma.rua.create({
          data: {
            name: rua,
            galpaoId: galpaoId,
          },
        });
      }
      ruaId = ruaExistente.id;
    }

    // Verifica se precisa criar/atualizar posição
    if (
      posicao &&
      (posicao !== nivelAtual.posicao.posicao ||
        ruaId !== nivelAtual.posicao.ruaId)
    ) {
      let posicaoExistente = await prisma.posicao.findFirst({
        where: {
          posicao: posicao,
          ruaId: ruaId,
        },
      });

      if (!posicaoExistente) {
        posicaoExistente = await prisma.posicao.create({
          data: {
            posicao: posicao,
            ruaId: ruaId,
          },
        });
      }
      posicaoIdFinal = posicaoExistente.id;
    }

    // Atualiza o nível
    const updated = await prisma.nivel.update({
      where: { id },
      data: {
        nivel: nivel,
        posicaoId: posicaoIdFinal,
      },
      include: {
        posicao: {
          include: {
            rua: {
              include: {
                galpao: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar estrutura" },
      { status: 500 },
    );
  }
}
