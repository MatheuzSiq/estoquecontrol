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

    // Verifica se os dados existem antes de acessar
    const formattedEstoque = inventory.map((item) => ({
      id: item.id,
      productCode: item.product?.code || "N/A",
      productDescription: item.product?.description || "N/A",
      lote: item.lote || "Sem lote",
      quantity: item.quantity,
      date: item.date,
      galpao: item.nivel?.posicao?.rua?.galpao?.name || "N/A",
      rua: item.nivel?.posicao?.rua?.name || "N/A",
      posicao: item.nivel?.posicao?.posicao || 0,
      nivel: item.nivel?.nivel || 0,
    }));

    return NextResponse.json(formattedEstoque);
  } catch (error) {
    console.error("Erro detalhado ao buscar estoque:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estoque", details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { productId, lote, quantity, nivelId, date } = data;

    // Validações mais robustas
    if (!productId || !nivelId || quantity === undefined) {
      return NextResponse.json(
        { error: "Campos obrigatórios: productId, nivelId, quantity" },
        { status: 400 },
      );
    }

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

    // Converte quantidade para número
    const quantityNum =
      typeof quantity === "string" ? parseFloat(quantity) : quantity;

    if (isNaN(quantityNum) || quantityNum <= 0) {
      return NextResponse.json(
        { error: "Quantidade inválida" },
        { status: 400 },
      );
    }

    // Cria o item no inventory
    const newInventory = await prisma.inventory.create({
      data: {
        productId,
        lote: lote || null,
        quantity: quantityNum,
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

    // Verificação de segurança antes de acessar propriedades aninhadas
    const responseItem = {
      id: newInventory.id,
      productCode: newInventory.product?.code || "N/A",
      productDescription: newInventory.product?.description || "N/A",
      lote: newInventory.lote || null,
      quantity: newInventory.quantity,
      date: newInventory.date,
      galpao: newInventory.nivel?.posicao?.rua?.galpao?.name || "N/A",
      rua: newInventory.nivel?.posicao?.rua?.name || "N/A",
      posicao: newInventory.nivel?.posicao?.posicao || 0,
      nivel: newInventory.nivel?.nivel || 0,
    };

    console.log("Item criado com sucesso:", responseItem);

    return NextResponse.json({
      success: true,
      item: responseItem,
    });
  } catch (error) {
    console.error("Erro detalhado ao criar item no estoque:", error);
    return NextResponse.json(
      { error: "Erro ao criar item no estoque", details: String(error) },
      { status: 500 },
    );
  }
}
