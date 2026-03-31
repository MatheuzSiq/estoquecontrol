import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
        nivel: {
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
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const formattedEstoque = inventory.map((item) => ({
      id: item.id,
      productCode: item.product.code,
      productDescription: item.product.description,
      lote: item.lote,
      quantity: item.quantity,
      date: item.date,
      galpao: item.nivel.posicao.rua.galpao.name,
      rua: item.nivel.posicao.rua.name,
      posicao: item.nivel.posicao.posicao,
      nivel: item.nivel.nivel,
    }));

    return NextResponse.json(formattedEstoque);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estoque" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { productId, lote, quantity, nivelId, date } = data;

    console.log("Recebendo dados:", {
      productId,
      lote,
      quantity,
      nivelId,
      date,
    });

    // Verifica se o produto existe
    const product = await prisma.catalog.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 },
      );
    }

    // Verifica se o nível existe
    const nivel = await prisma.nivel.findUnique({
      where: { id: nivelId },
    });

    if (!nivel) {
      return NextResponse.json(
        { error: "Localização não encontrada" },
        { status: 404 },
      );
    }

    // Cria o item no inventory
    const newInventory = await prisma.inventory.create({
      data: {
        productId,
        lote: lote || null,
        quantity: parseFloat(quantity),
        nivelId,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        product: true,
        nivel: {
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
        },
      },
    });

    console.log("Item criado:", newInventory);

    return NextResponse.json({
      success: true,
      item: {
        id: newInventory.id,
        productCode: newInventory.product.code,
        productDescription: newInventory.product.description,
        lote: newInventory.lote,
        quantity: newInventory.quantity,
        date: newInventory.date,
        galpao: newInventory.nivel.posicao.rua.galpao.name,
        rua: newInventory.nivel.posicao.rua.name,
        posicao: newInventory.nivel.posicao.posicao,
        nivel: newInventory.nivel.nivel,
      },
    });
  } catch (error) {
    console.error("Erro ao criar item no estoque:", error);
    return NextResponse.json(
      { error: "Erro ao criar item no estoque" },
      { status: 500 },
    );
  }
}
